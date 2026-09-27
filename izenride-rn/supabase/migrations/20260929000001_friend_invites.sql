-- =============================================================================
-- IzenRide — Lot 3 : invitation d'un ami, rattachement, onboarding, bienvenue.
--
--   * L'inviteur crée une invitation : code de 8 caractères (lien + QR code),
--     téléphone et/ou email optionnels, groupes mémorisés dès la création.
--   * Téléphone et email ne sont jamais stockés en clair : empreinte
--     HMAC-SHA256 avec une clé serveur, effacée au rattachement ou à expiration.
--   * À l'inscription, `claim_friend_invite` rattache l'ami : par code d'abord,
--     sinon par téléphone ou email VÉRIFIÉS. Les groupes mémorisés deviennent
--     des invitations (ou des suggestions « Membre » si l'inviteur n'a pas le
--     droit d'inviter).
--   * L'ami peut annuler le rattachement (« Ce n'est pas moi »).
-- =============================================================================

create extension if not exists pgcrypto with schema extensions;

-- Clé HMAC hors de portée des clients (schéma non exposé par l'API).
create schema if not exists private;
revoke all on schema private from public;
create table if not exists private.app_secrets (name text primary key, value text not null);
insert into private.app_secrets (name, value)
values ('invite_hmac_key', encode(extensions.gen_random_bytes(32), 'hex'))
on conflict (name) do nothing;

-- -----------------------------------------------------------------------------
-- Normalisation et empreintes (miroir de src/api/contacts.ts)
-- -----------------------------------------------------------------------------

-- Format E.164 ; numéros français à 10 chiffres acceptés (06… -> +336…).
-- Accepte aussi le format de auth.users.phone (chiffres sans « + »).
create or replace function public.normalize_phone(p text)
returns text
language plpgsql
immutable
as $$
declare
  v text;
begin
  if p is null or btrim(p) = '' then
    return null;
  end if;
  v := regexp_replace(p, '[\s.\-()]', '', 'g');
  if v ~ '^00' then
    v := '+' || substr(v, 3);
  elsif v ~ '^0[1-9][0-9]{8}$' then
    v := '+33' || substr(v, 2);
  elsif v ~ '^[1-9][0-9]{7,14}$' then
    v := '+' || v;
  end if;
  return case when v ~ '^\+[1-9][0-9]{7,14}$' then v end;
end;
$$;

create or replace function public.normalize_email(p text)
returns text
language sql
immutable
as $$
  select case when lower(btrim(p)) ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then lower(btrim(p)) end;
$$;

create or replace function public.contact_hash(p text)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select case when p is null then null else encode(extensions.hmac(
    p, (select value from private.app_secrets where name = 'invite_hmac_key'), 'sha256'), 'hex') end;
$$;

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------
create table public.friend_invites (
  id               uuid primary key default gen_random_uuid(),
  inviter_id       uuid not null references auth.users (id) on delete cascade,
  code             text not null unique check (code ~ '^[A-HJ-NP-Z2-9]{8}$'),
  phone_hash       text,
  email_hash       text,
  preset_group_ids uuid[] not null default '{}' check (cardinality(preset_group_ids) <= 10),
  status           text not null default 'pending'
                   check (status in ('pending', 'claimed', 'cancelled', 'expired', 'unlinked')),
  via              text check (via in ('code', 'contact')),
  accepted_by      uuid references auth.users (id) on delete set null,
  claimed_at       timestamptz,
  welcomed_at      timestamptz,
  expires_at       timestamptz not null default now() + interval '30 days',
  created_at       timestamptz not null default now()
);
-- Un ami n'est rattaché qu'à une seule invitation.
create unique index friend_invites_one_claim on public.friend_invites (accepted_by) where status = 'claimed';
create index friend_invites_inviter on public.friend_invites (inviter_id, created_at desc);
create index friend_invites_phone on public.friend_invites (phone_hash) where status = 'pending';
create index friend_invites_email on public.friend_invites (email_hash) where status = 'pending';

-- Messages 1-1 minimalistes : message de bienvenue, « V » de motard, sortie proposée.
create table public.direct_messages (
  id           uuid primary key default gen_random_uuid(),
  sender_id    uuid not null references auth.users (id) on delete cascade,
  recipient_id uuid not null references auth.users (id) on delete cascade,
  kind         text not null check (kind in ('text', 'wave', 'ride')),
  body         text check (char_length(body) <= 2000),
  payload      jsonb,
  created_at   timestamptz not null default now(),
  read_at      timestamptz,
  check (sender_id <> recipient_id)
);
create index direct_messages_pair on public.direct_messages (recipient_id, sender_id, created_at desc);

-- Aucun accès direct à friend_invites (empreintes) : lecture par RPC uniquement.
alter table public.friend_invites enable row level security;
alter table public.direct_messages enable row level security;
create policy direct_messages_select on public.direct_messages
  for select to authenticated using (sender_id = auth.uid() or recipient_id = auth.uid());
grant select on public.direct_messages to authenticated;

-- -----------------------------------------------------------------------------
-- Helpers
-- -----------------------------------------------------------------------------
create or replace function public.new_invite_code()
returns text
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  bytes bytea;
  v text;
begin
  loop
    bytes := extensions.gen_random_bytes(8);
    v := '';
    for i in 0 .. 7 loop
      v := v || substr(alphabet, (get_byte(bytes, i) % 32) + 1, 1);
    end loop;
    exit when not exists (select 1 from public.friend_invites where code = v);
  end loop;
  return v;
end;
$$;

-- Vérifie que l'utilisateur est membre de chaque groupe mémorisé.
create or replace function public.assert_preset_groups(p_groups uuid[])
returns uuid[]
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v uuid[] := coalesce((select array_agg(distinct g) from unnest(p_groups) g where g is not null), '{}');
begin
  if cardinality(v) > 10 then
    raise exception 'too_many_groups' using errcode = '22023';
  end if;
  if exists (select 1 from unnest(v) g
             where not exists (select 1 from public.group_members m where m.group_id = g and m.user_id = auth.uid())) then
    raise exception 'not_member' using errcode = '42501';
  end if;
  return v;
end;
$$;

-- -----------------------------------------------------------------------------
-- RPC côté inviteur
-- -----------------------------------------------------------------------------
create or replace function public.create_friend_invite(
  p_phone     text default null,
  p_email     text default null,
  p_group_ids uuid[] default '{}'
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_phone  text := public.normalize_phone(p_phone);
  v_email  text := public.normalize_email(p_email);
  v_groups uuid[];
  v_id     uuid;
  v_code   text;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if nullif(btrim(coalesce(p_phone, '')), '') is not null and v_phone is null then
    raise exception 'invalid_phone' using errcode = '22023';
  end if;
  if nullif(btrim(coalesce(p_email, '')), '') is not null and v_email is null then
    raise exception 'invalid_email' using errcode = '22023';
  end if;
  if (select count(*) from public.friend_invites
      where inviter_id = auth.uid() and status = 'pending' and expires_at > now()) >= 50 then
    raise exception 'too_many_invites' using errcode = '54000';
  end if;
  v_groups := public.assert_preset_groups(p_group_ids);
  v_code := public.new_invite_code();

  insert into public.friend_invites (inviter_id, code, phone_hash, email_hash, preset_group_ids)
  values (auth.uid(), v_code, public.contact_hash(v_phone), public.contact_hash(v_email), v_groups)
  returning id into v_id;
  return jsonb_build_object('id', v_id, 'code', v_code);
end;
$$;

create or replace function public.update_friend_invite_groups(p_invite uuid, p_group_ids uuid[])
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_groups uuid[] := public.assert_preset_groups(p_group_ids);
begin
  update public.friend_invites set preset_group_ids = v_groups
  where id = p_invite and inviter_id = auth.uid() and status = 'pending' and expires_at > now();
  if not found then
    raise exception 'friend_invite_not_found' using errcode = 'P0002';
  end if;
end;
$$;

create or replace function public.cancel_friend_invite(p_invite uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.friend_invites set status = 'cancelled', phone_hash = null, email_hash = null
  where id = p_invite and inviter_id = auth.uid() and status in ('pending', 'expired');
  if not found then
    raise exception 'friend_invite_not_found' using errcode = 'P0002';
  end if;
end;
$$;

-- Relance : repart pour 30 jours (les empreintes déjà purgées ne reviennent pas).
create or replace function public.renew_friend_invite(p_invite uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.friend_invites set status = 'pending', expires_at = now() + interval '30 days'
  where id = p_invite and inviter_id = auth.uid()
    and (status = 'expired' or (status = 'pending'));
  if not found then
    raise exception 'friend_invite_not_found' using errcode = 'P0002';
  end if;
end;
$$;

create or replace function public.my_friend_invites()
returns table (
  id               uuid,
  code             text,
  status           text,
  has_phone        boolean,
  has_email        boolean,
  preset_group_ids uuid[],
  accepted_by      uuid,
  claimed_at       timestamptz,
  welcomed_at      timestamptz,
  expires_at       timestamptz,
  created_at       timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select f.id, f.code,
         case when f.status = 'pending' and f.expires_at <= now() then 'expired' else f.status end,
         f.phone_hash is not null, f.email_hash is not null,
         f.preset_group_ids, f.accepted_by, f.claimed_at, f.welcomed_at, f.expires_at, f.created_at
  from public.friend_invites f
  where f.inviter_id = auth.uid()
  order by f.created_at desc;
$$;

create or replace function public.mark_friend_welcomed(p_invite uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.friend_invites set welcomed_at = coalesce(welcomed_at, now())
  where id = p_invite and inviter_id = auth.uid() and status = 'claimed';
$$;

-- -----------------------------------------------------------------------------
-- RPC côté ami invité
-- -----------------------------------------------------------------------------

-- Ouvre les groupes mémorisés à l'ami : invitation si l'inviteur a le droit
-- d'inviter, sinon suggestion « Membre ». Un groupe en échec est ignoré.
create or replace function public.open_preset_groups(p_invite public.friend_invites)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  g        uuid;
  v_out    jsonb := '[]'::jsonb;
  v_pay    jsonb;
  v_id     uuid;
  v_mode   text;
begin
  foreach g in array p_invite.preset_group_ids loop
    begin
      if not exists (select 1 from public.group_members where group_id = g and user_id = p_invite.inviter_id) then
        continue;
      end if;
      v_pay := public.normalize_group_payload(g, 'member',
        jsonb_build_object('user_id', p_invite.accepted_by, 'intro', 'Invité sur IzenRide'));
      if 'member.invite' = any (public.group_member_permissions(g, p_invite.inviter_id)) then
        v_id := public.apply_group_payload(g, 'member', v_pay, p_invite.inviter_id, null);
        v_mode := 'invite';
      else
        insert into public.group_suggestions (group_id, author_id, type, payload, expires_at)
        values (g, p_invite.inviter_id, 'member', v_pay, now() + interval '14 days')
        returning id into v_id;
        insert into public.group_messages (group_id, author_id, kind, ref_id)
        values (g, p_invite.inviter_id, 'suggestion', v_id);
        v_mode := 'suggestion';
      end if;
      v_out := v_out || jsonb_build_object('group_id', g, 'mode', v_mode, 'id', v_id);
    exception when others then
      v_out := v_out || jsonb_build_object('group_id', g, 'mode', 'skipped', 'reason', sqlerrm);
    end;
  end loop;
  return v_out;
end;
$$;

-- Rattachement à l'inscription. Idempotent : renvoie le rattachement existant.
create or replace function public.claim_friend_invite(p_code text default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid    uuid := auth.uid();
  v_inv    public.friend_invites;
  v_user   record;
  v_phone  text;
  v_email  text;
  v_via    text;
  v_groups jsonb;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select * into v_inv from public.friend_invites where accepted_by = v_uid and status = 'claimed';
  if found then
    return jsonb_build_object('status', 'already_claimed', 'invite_id', v_inv.id, 'inviter_id', v_inv.inviter_id);
  end if;

  -- 1. Code du lien, du QR code ou saisi à la main.
  if nullif(btrim(coalesce(p_code, '')), '') is not null then
    select * into v_inv from public.friend_invites
    where code = upper(btrim(p_code)) and status = 'pending' and expires_at > now() and inviter_id <> v_uid
    for update;
    if found then v_via := 'code'; end if;
  end if;

  -- 2. Téléphone ou email vérifiés : l'invitation la plus récente gagne.
  if v_via is null then
    select phone, phone_confirmed_at, email, email_confirmed_at into v_user from auth.users where id = v_uid;
    v_phone := case when v_user.phone_confirmed_at is not null then public.contact_hash(public.normalize_phone(v_user.phone)) end;
    v_email := case when v_user.email_confirmed_at is not null then public.contact_hash(public.normalize_email(v_user.email)) end;
    if v_phone is not null or v_email is not null then
      select * into v_inv from public.friend_invites
      where status = 'pending' and expires_at > now() and inviter_id <> v_uid
        and ((v_phone is not null and phone_hash = v_phone) or (v_email is not null and email_hash = v_email))
      order by created_at desc
      limit 1
      for update;
      if found then v_via := 'contact'; end if;
    end if;
  end if;

  if v_via is null then
    return jsonb_build_object('status', 'none');
  end if;

  update public.friend_invites
  set status = 'claimed', accepted_by = v_uid, claimed_at = now(), via = v_via, phone_hash = null, email_hash = null
  where id = v_inv.id
  returning * into v_inv;

  v_groups := public.open_preset_groups(v_inv);
  return jsonb_build_object('status', 'claimed', 'invite_id', v_inv.id, 'inviter_id', v_inv.inviter_id,
                            'via', v_via, 'groups', v_groups);
end;
$$;

-- Onboarding de l'ami : qui l'a invité, et l'état de chaque groupe ouvert.
create or replace function public.my_invitation()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'invite_id', f.id,
    'inviter_id', f.inviter_id,
    'claimed_at', f.claimed_at,
    'groups', coalesce((
      select jsonb_agg(jsonb_build_object(
        'group_id', g.id,
        'name', g.name,
        'kind', g.kind,
        'verified_at', g.verified_at,
        'member_count', (select count(*) from public.group_members x where x.group_id = g.id),
        'invite_id', (select i.id from public.group_invites i
                      where i.group_id = g.id and i.invitee_id = auth.uid() and i.status = 'pending' limit 1),
        'status', case
          when exists (select 1 from public.group_members m where m.group_id = g.id and m.user_id = auth.uid()) then 'member'
          when exists (select 1 from public.group_invites i where i.group_id = g.id and i.invitee_id = auth.uid() and i.status = 'pending') then 'invited'
          when exists (select 1 from public.group_suggestions s where s.group_id = g.id and s.type = 'member'
                       and s.status = 'pending' and s.expires_at > now() and s.payload ->> 'user_id' = auth.uid()::text) then 'pending_approval'
          else 'none' end
      ) order by array_position(f.preset_group_ids, g.id))
      from public.groups g where g.id = any (f.preset_group_ids)), '[]'::jsonb)
  )
  from public.friend_invites f
  where f.accepted_by = auth.uid() and f.status = 'claimed';
$$;

-- « Ce n'est pas moi » : annule le rattachement et ce qu'il a ouvert.
create or replace function public.unlink_friend_invite()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_inv public.friend_invites;
begin
  select * into v_inv from public.friend_invites where accepted_by = auth.uid() and status = 'claimed' for update;
  if not found then
    raise exception 'friend_invite_not_found' using errcode = 'P0002';
  end if;
  update public.friend_invites set status = 'unlinked' where id = v_inv.id;
  update public.group_invites set status = 'declined', responded_at = now()
  where invitee_id = auth.uid() and status = 'pending' and invited_by = v_inv.inviter_id
    and group_id = any (v_inv.preset_group_ids);
  update public.group_suggestions set status = 'withdrawn'
  where author_id = v_inv.inviter_id and type = 'member' and status = 'pending'
    and payload ->> 'user_id' = auth.uid()::text and group_id = any (v_inv.preset_group_ids);
end;
$$;

-- -----------------------------------------------------------------------------
-- RPC : bienvenue (côté inviteur) et messages 1-1
-- -----------------------------------------------------------------------------

-- Deux personnes peuvent s'écrire si l'une a invité l'autre ou si elles
-- partagent un groupe.
create or replace function public.can_message(p_a uuid, p_b uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.friend_invites f
    where f.status = 'claimed'
      and ((f.inviter_id = p_a and f.accepted_by = p_b) or (f.inviter_id = p_b and f.accepted_by = p_a))
  ) or exists (
    select 1 from public.group_members a join public.group_members b on a.group_id = b.group_id
    where a.user_id = p_a and b.user_id = p_b
  );
$$;

create or replace function public.send_direct_message(p_to uuid, p_kind text, p_body text default null, p_payload jsonb default null)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_ts timestamptz;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if p_to is null or p_to = auth.uid() or not public.can_message(auth.uid(), p_to) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  case p_kind
  when 'text' then
    if char_length(coalesce(btrim(p_body), '')) not between 1 and 2000 then
      raise exception 'invalid_payload' using errcode = '22023';
    end if;
  when 'wave' then
    null;
  when 'ride' then
    begin
      v_ts := (p_payload ->> 'starts_at')::timestamptz;
    exception when others then
      raise exception 'invalid_payload' using errcode = '22023';
    end;
    if char_length(coalesce(btrim(p_payload ->> 'title'), '')) not between 2 and 80
       or v_ts is null or v_ts <= now()
       or char_length(coalesce(btrim(p_payload ->> 'meeting_point'), '')) not between 2 and 200 then
      raise exception 'invalid_payload' using errcode = '22023';
    end if;
  else
    raise exception 'invalid_payload' using errcode = '22023';
  end case;

  insert into public.direct_messages (sender_id, recipient_id, kind, body, payload)
  values (auth.uid(), p_to, p_kind, nullif(btrim(coalesce(p_body, '')), ''), p_payload)
  returning id into v_id;
  return v_id;
end;
$$;

-- -----------------------------------------------------------------------------
-- Serveur (service_role) : expiration, jetons push pour l'Edge Function.
-- -----------------------------------------------------------------------------
create or replace function public.expire_friend_invites()
returns int
language sql
security definer
set search_path = ''
as $$
  with done as (
    update public.friend_invites set status = 'expired', phone_hash = null, email_hash = null
    where status = 'pending' and expires_at <= now()
    returning 1
  )
  select count(*)::int from done;
$$;

create or replace function public.user_push_tokens_of(p_user uuid)
returns table (user_id uuid, token text, platform text)
language sql
stable
security definer
set search_path = ''
as $$
  select t.user_id, t.token, t.platform from public.user_push_tokens t where t.user_id = p_user;
$$;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.direct_messages;
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- Droits d'exécution
-- -----------------------------------------------------------------------------
revoke execute on function
  public.normalize_phone(text),
  public.normalize_email(text),
  public.contact_hash(text),
  public.new_invite_code(),
  public.assert_preset_groups(uuid[]),
  public.create_friend_invite(text, text, uuid[]),
  public.update_friend_invite_groups(uuid, uuid[]),
  public.cancel_friend_invite(uuid),
  public.renew_friend_invite(uuid),
  public.my_friend_invites(),
  public.mark_friend_welcomed(uuid),
  public.open_preset_groups(public.friend_invites),
  public.claim_friend_invite(text),
  public.my_invitation(),
  public.unlink_friend_invite(),
  public.can_message(uuid, uuid),
  public.send_direct_message(uuid, text, text, jsonb),
  public.expire_friend_invites(),
  public.user_push_tokens_of(uuid)
from public, anon, authenticated;

grant execute on function
  public.create_friend_invite(text, text, uuid[]),
  public.update_friend_invite_groups(uuid, uuid[]),
  public.cancel_friend_invite(uuid),
  public.renew_friend_invite(uuid),
  public.my_friend_invites(),
  public.mark_friend_welcomed(uuid),
  public.claim_friend_invite(text),
  public.my_invitation(),
  public.unlink_friend_invite(),
  public.send_direct_message(uuid, text, text, jsonb)
to authenticated;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function public.expire_friend_invites(), public.user_push_tokens_of(uuid) to service_role;
  end if;
end $$;
