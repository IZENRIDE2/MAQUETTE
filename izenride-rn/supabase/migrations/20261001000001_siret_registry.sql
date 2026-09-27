-- =============================================================================
-- IzenRide — Vérification des SIRET au registre des entreprises (Pappers).
--
--   * L'Edge Function `siret-check` interroge l'API Pappers (clé côté serveur)
--     et range le résultat dans `siret_checks`, un cache lisible seulement
--     par le serveur.
--   * `request_group_verification` refuse un SIRET que le registre dit fermé
--     ou inconnu. Si le registre n'a pas répondu, la demande passe et le
--     modérateur voit « non vérifié au registre ».
--   * Les badges accordés sont revérifiés chaque mois : un établissement
--     fermé depuis remonte dans « Badges à revoir » (le retrait reste une
--     décision de modération).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Cache du registre (écrit par l'Edge Function avec la clé service_role)
-- -----------------------------------------------------------------------------
create table public.siret_checks (
  siret       text primary key check (siret ~ '^[0-9]{14}$'),
  status      text not null check (status in ('active', 'closed', 'not_found')),
  siren       text,
  legal_name  text,
  trade_name  text,
  legal_form  text,
  naf_label   text,
  address     text,
  created_on  date,
  closed_on   date,
  checked_at  timestamptz not null default now()
);
alter table public.siret_checks enable row level security;

-- Consultations par utilisateur, pour plafonner la consommation de crédits.
create table public.siret_lookups (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users (id) on delete cascade,
  siret      text not null,
  created_at timestamptz not null default now()
);
create index siret_lookups_user on public.siret_lookups (user_id, created_at);
alter table public.siret_lookups enable row level security;

-- Ni lecture ni écriture depuis le client : seul le serveur y touche.
revoke all on public.siret_checks, public.siret_lookups from anon, authenticated;

-- -----------------------------------------------------------------------------
-- Qui peut consulter le registre : les fondateurs de groupes pro et les
-- modérateurs. Appelé par l'Edge Function avec le jeton de l'utilisateur.
-- -----------------------------------------------------------------------------
create or replace function public.can_lookup_siret()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_app_moderator() or exists (
    select 1
    from public.group_members m
    join public.group_roles r on r.id = m.role_id and r.is_founder
    join public.groups g on g.id = m.group_id and g.kind = 'pro'
    where m.user_id = auth.uid()
  );
$$;

-- Résultat du registre tel que l'app l'affiche (null si jamais consulté).
create or replace function public.siret_check_json(p_siret text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'status', c.status, 'siren', c.siren, 'legal_name', c.legal_name, 'trade_name', c.trade_name,
    'legal_form', c.legal_form, 'naf_label', c.naf_label, 'address', c.address,
    'created_on', c.created_on, 'closed_on', c.closed_on, 'checked_at', c.checked_at)
  from public.siret_checks c
  where c.siret = p_siret;
$$;

-- -----------------------------------------------------------------------------
-- Demande de badge : le registre a le dernier mot quand il a répondu.
-- -----------------------------------------------------------------------------
create or replace function public.request_group_verification(
  p_group         uuid,
  p_legal_name    text,
  p_siret         text,
  p_website       text default null,
  p_document_path text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_siret  text := regexp_replace(coalesce(p_siret, ''), '\s', '', 'g');
  v_status text;
  v_id     uuid;
begin
  if public.assert_group_perm(p_group, null) <> 100 then
    raise exception 'founder_only' using errcode = '42501';
  end if;
  if (select kind from public.groups where id = p_group) <> 'pro' then
    raise exception 'pro_only' using errcode = '42501';
  end if;
  if (select verified_at from public.groups where id = p_group) is not null then
    raise exception 'already_verified' using errcode = '23505';
  end if;
  if exists (select 1 from public.group_verification_requests where group_id = p_group and status = 'pending') then
    raise exception 'verification_pending' using errcode = '23505';
  end if;
  if not public.is_valid_siret(v_siret) then
    raise exception 'invalid_siret' using errcode = '22023';
  end if;
  -- Consultation récente du registre (l'app la fait pendant la saisie).
  select status into v_status from public.siret_checks
  where siret = v_siret and checked_at > now() - interval '30 days';
  if v_status = 'closed' then
    raise exception 'siret_closed' using errcode = '22023';
  elsif v_status = 'not_found' then
    raise exception 'siret_not_found' using errcode = '22023';
  end if;
  if char_length(coalesce(btrim(p_legal_name), '')) not between 2 and 120 then
    raise exception 'invalid_payload' using errcode = '22023';
  end if;
  if p_document_path is not null and p_document_path not like p_group::text || '/%' then
    raise exception 'invalid_payload' using errcode = '22023';
  end if;

  insert into public.group_verification_requests (group_id, submitted_by, legal_name, siret, website, document_path)
  values (p_group, auth.uid(), btrim(p_legal_name), v_siret, nullif(btrim(coalesce(p_website, '')), ''), p_document_path)
  returning id into v_id;
  perform public.log_group_activity(p_group, 'verification.requested', jsonb_build_object('request_id', v_id));
  return v_id;
end;
$$;

-- File de modération : + résultat du registre.
drop function public.pending_verifications();
create function public.pending_verifications()
returns table (
  id            uuid,
  group_id      uuid,
  group_name    text,
  member_count  int,
  legal_name    text,
  siret         text,
  website       text,
  document_path text,
  submitted_by  uuid,
  created_at    timestamptz,
  registry      jsonb
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_app_moderator() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  return query
    select r.id, g.id, g.name, (select count(*)::int from public.group_members m where m.group_id = g.id),
           r.legal_name, r.siret, r.website, r.document_path, r.submitted_by, r.created_at,
           public.siret_check_json(r.siret)
    from public.group_verification_requests r
    join public.groups g on g.id = r.group_id
    where r.status = 'pending'
    order by r.created_at;
end;
$$;

-- Badges accordés dont l'établissement n'est plus actif au registre.
create or replace function public.flagged_verified_groups()
returns table (
  group_id    uuid,
  group_name  text,
  verified_at timestamptz,
  legal_name  text,
  siret       text,
  registry    jsonb
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_app_moderator() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  return query
    select g.id, g.name, g.verified_at, r.legal_name, r.siret, public.siret_check_json(r.siret)
    from public.groups g
    join lateral (
      select v.legal_name, v.siret from public.group_verification_requests v
      where v.group_id = g.id and v.status = 'approved'
      order by v.decided_at desc limit 1
    ) r on true
    join public.siret_checks c on c.siret = r.siret and c.status <> 'active'
    where g.verified_at is not null
    order by c.checked_at desc;
end;
$$;

-- SIRET des badges à revérifier (Edge Function en mode `recheck`, service_role) :
-- jamais consultés ou consultés il y a plus de 30 jours, les plus anciens d'abord.
create or replace function public.sirets_to_recheck(p_limit int default 50)
returns table (siret text)
language sql
stable
security definer
set search_path = ''
as $$
  select v.siret
  from public.groups g
  join public.group_verification_requests v on v.group_id = g.id and v.status = 'approved'
  left join public.siret_checks c on c.siret = v.siret
  where g.verified_at is not null
    and (c.checked_at is null or c.checked_at < now() - interval '30 days')
  group by v.siret
  order by min(coalesce(c.checked_at, '-infinity'::timestamptz))
  limit greatest(1, least(p_limit, 500));
$$;

-- Plafond de consultations (Edge Function, service_role) : 20 par heure et
-- par personne ; les modérateurs ne sont pas plafonnés.
create or replace function public.note_siret_lookup(p_user uuid, p_siret text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.app_moderators where user_id = p_user)
     and (select count(*) from public.siret_lookups where user_id = p_user and created_at > now() - interval '1 hour') >= 20 then
    return false;
  end if;
  insert into public.siret_lookups (user_id, siret) values (p_user, p_siret);
  delete from public.siret_lookups where created_at < now() - interval '7 days';
  return true;
end;
$$;

-- -----------------------------------------------------------------------------
-- Droits d'exécution
-- -----------------------------------------------------------------------------
revoke execute on function
  public.can_lookup_siret(),
  public.siret_check_json(text),
  public.request_group_verification(uuid, text, text, text, text),
  public.pending_verifications(),
  public.flagged_verified_groups(),
  public.sirets_to_recheck(int),
  public.note_siret_lookup(uuid, text)
from public, anon, authenticated;

grant execute on function
  public.can_lookup_siret(),
  public.request_group_verification(uuid, text, text, text, text),
  public.pending_verifications(),
  public.flagged_verified_groups()
to authenticated;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function public.sirets_to_recheck(int), public.note_siret_lookup(uuid, text) to service_role;
    grant select, insert, update on public.siret_checks to service_role;
  end if;
end $$;
