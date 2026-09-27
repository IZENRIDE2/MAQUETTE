-- =============================================================================
-- IzenRide — Lot 4 : groupes pro.
--
--   * Badge vérifié : le fondateur d'un groupe pro envoie une demande
--     (raison sociale, SIRET, justificatif, site). Une file de modération
--     IzenRide (table app_moderators) accepte ou refuse ; le badge peut être
--     retiré.
--   * Sorties promues : une sortie pro non réservée aux membres est publique
--     dans l'onglet Événements ; tout rider peut s'y inscrire sans entrer
--     dans le groupe.
--   * Statistiques et journal (rétention 12 mois) pour `insights.view`.
--   * Flag premium : `has_feature` prépare l'offre payante (tout ouvert).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Modérateurs IzenRide et demandes de vérification
-- -----------------------------------------------------------------------------
create table public.app_moderators (
  user_id  uuid primary key references auth.users (id) on delete cascade,
  added_at timestamptz not null default now()
);
alter table public.app_moderators enable row level security;

create table public.group_verification_requests (
  id            uuid primary key default gen_random_uuid(),
  group_id      uuid not null references public.groups (id) on delete cascade,
  submitted_by  uuid references auth.users (id) on delete set null,
  legal_name    text not null check (char_length(btrim(legal_name)) between 2 and 120),
  siret         text not null check (siret ~ '^[0-9]{14}$'),
  website       text check (char_length(website) <= 200),
  document_path text check (char_length(document_path) <= 300),
  status        text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'revoked')),
  reviewer_id   uuid references auth.users (id) on delete set null,
  reviewer_note text check (char_length(reviewer_note) <= 500),
  created_at    timestamptz not null default now(),
  decided_at    timestamptz
);
create unique index group_verification_one_pending on public.group_verification_requests (group_id) where status = 'pending';
create index group_verification_status on public.group_verification_requests (status, created_at);
alter table public.group_verification_requests enable row level security;

-- Journal : index pour la purge à 12 mois.
create index if not exists group_activity_log_created on public.group_activity_log (created_at);

-- -----------------------------------------------------------------------------
-- Helpers
-- -----------------------------------------------------------------------------
create or replace function public.is_app_moderator()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.app_moderators where user_id = auth.uid());
$$;

-- Clé de Luhn du SIRET. La Poste (SIREN 356000000) : ses établissements
-- suivent une autre règle (somme des chiffres multiple de 5), son siège Luhn.
create or replace function public.is_valid_siret(p text)
returns boolean
language plpgsql
immutable
as $$
declare
  luhn int := 0;
  total int := 0;
  d    int;
  i    int;
begin
  if p is null or p !~ '^[0-9]{14}$' then
    return false;
  end if;
  for i in 1 .. 14 loop
    d := substr(p, 15 - i, 1)::int;
    total := total + d;
    if i % 2 = 0 then
      d := d * 2;
      if d > 9 then d := d - 9; end if;
    end if;
    luhn := luhn + d;
  end loop;
  return luhn % 10 = 0 or (substr(p, 1, 9) = '356000000' and total % 5 = 0);
end;
$$;

-- Dossier Storage « <group_id>/… » : l'utilisateur courant est-il fondateur
-- de ce groupe ? Tolère un nom de dossier qui n'est pas un uuid.
create or replace function public.is_founder_of_folder(p_folder text)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  return p_folder ~ '^[0-9a-f-]{36}$' and public.group_member_rank(p_folder::uuid) = 100;
end;
$$;

-- Flag premium : toutes les fonctionnalités restent ouvertes tant que l'offre
-- payante n'est pas définie. Point d'entrée unique pour la brancher plus tard.
create or replace function public.has_feature(p_group uuid, p_feature text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.groups where id = p_group);
$$;

-- -----------------------------------------------------------------------------
-- RLS : le groupe voit ses demandes (insights.view ou fondateur), les
-- modérateurs voient tout.
-- -----------------------------------------------------------------------------
create policy group_verification_select on public.group_verification_requests
  for select to authenticated using (
    public.is_app_moderator()
    or public.has_group_perm(group_id, 'group.edit')
  );
grant select on public.group_verification_requests to authenticated;

create policy app_moderators_select on public.app_moderators
  for select to authenticated using (user_id = auth.uid());
grant select on public.app_moderators to authenticated;

-- -----------------------------------------------------------------------------
-- RPC : badge vérifié
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
  v_siret text := regexp_replace(coalesce(p_siret, ''), '\s', '', 'g');
  v_id    uuid;
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
  if char_length(coalesce(btrim(p_legal_name), '')) not between 2 and 120 then
    raise exception 'invalid_payload' using errcode = '22023';
  end if;
  -- Le justificatif doit être rangé dans le dossier du groupe (Storage).
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

-- File de modération (modérateurs IzenRide).
create or replace function public.pending_verifications()
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
  created_at    timestamptz
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
           r.legal_name, r.siret, r.website, r.document_path, r.submitted_by, r.created_at
    from public.group_verification_requests r
    join public.groups g on g.id = r.group_id
    where r.status = 'pending'
    order by r.created_at;
end;
$$;

create or replace function public.decide_group_verification(p_request uuid, p_approve boolean, p_note text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_req public.group_verification_requests;
begin
  if not public.is_app_moderator() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  select * into v_req from public.group_verification_requests where id = p_request and status = 'pending' for update;
  if not found then
    raise exception 'verification_not_found' using errcode = 'P0002';
  end if;
  if not p_approve and char_length(coalesce(btrim(p_note), '')) = 0 then
    raise exception 'reason_required' using errcode = '22023';
  end if;

  update public.group_verification_requests
  set status = case when p_approve then 'approved' else 'rejected' end,
      reviewer_id = auth.uid(), reviewer_note = nullif(btrim(coalesce(p_note, '')), ''), decided_at = now()
  where id = p_request;
  if p_approve then
    update public.groups set verified_at = now() where id = v_req.group_id;
  end if;
  insert into public.group_activity_log (group_id, actor_id, action, target)
  values (v_req.group_id, auth.uid(), case when p_approve then 'verification.approved' else 'verification.rejected' end,
          jsonb_build_object('request_id', p_request, 'note', p_note));
end;
$$;

-- Retrait du badge (SIRET devenu inactif, décision de modération).
create or replace function public.revoke_group_verification(p_group uuid, p_reason text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_app_moderator() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if char_length(coalesce(btrim(p_reason), '')) = 0 then
    raise exception 'reason_required' using errcode = '22023';
  end if;
  update public.groups set verified_at = null where id = p_group and verified_at is not null;
  if not found then
    raise exception 'verification_not_found' using errcode = 'P0002';
  end if;
  update public.group_verification_requests set status = 'revoked', reviewer_id = auth.uid(), reviewer_note = btrim(p_reason), decided_at = now()
  where group_id = p_group and status = 'approved';
  insert into public.group_activity_log (group_id, actor_id, action, target)
  values (p_group, auth.uid(), 'verification.revoked', jsonb_build_object('reason', btrim(p_reason)));
end;
$$;

-- -----------------------------------------------------------------------------
-- RPC : sorties promues dans Événements
-- -----------------------------------------------------------------------------

-- Sorties pro publiques à venir, visibles de tout rider connecté.
create or replace function public.public_pro_rides(p_limit int default 50)
returns table (
  id            uuid,
  group_id      uuid,
  group_name    text,
  verified_at   timestamptz,
  title         text,
  starts_at     timestamptz,
  meeting_point text,
  route         text,
  level         text,
  participants  int,
  going         boolean,
  is_member     boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select r.id, g.id, g.name, g.verified_at, r.title, r.starts_at, r.meeting_point, r.route, r.level,
         (select count(*)::int from public.group_ride_participants p where p.ride_id = r.id),
         exists (select 1 from public.group_ride_participants p where p.ride_id = r.id and p.user_id = auth.uid()),
         exists (select 1 from public.group_members m where m.group_id = g.id and m.user_id = auth.uid())
  from public.group_rides r
  join public.groups g on g.id = r.group_id
  where g.kind = 'pro' and not r.members_only and r.starts_at > now()
  order by r.starts_at
  limit least(greatest(coalesce(p_limit, 50), 1), 200);
$$;

-- Inscription d'un rider hors groupe à une sortie pro promue.
create or replace function public.join_public_ride(p_ride uuid, p_join boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if not exists (select 1 from public.group_rides r join public.groups g on g.id = r.group_id
                 where r.id = p_ride and g.kind = 'pro' and not r.members_only and r.starts_at > now()) then
    raise exception 'ride_not_found' using errcode = 'P0002';
  end if;
  if p_join then
    insert into public.group_ride_participants (ride_id, user_id) values (p_ride, auth.uid()) on conflict do nothing;
  else
    delete from public.group_ride_participants where ride_id = p_ride and user_id = auth.uid();
  end if;
end;
$$;

-- -----------------------------------------------------------------------------
-- RPC : statistiques (insights.view)
-- -----------------------------------------------------------------------------
create or replace function public.group_stats(p_group uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_decided interval;
begin
  perform public.assert_group_perm(p_group, 'insights.view');

  select percentile_cont(0.5) within group (order by decided_at - created_at)
  into v_decided
  from public.group_suggestions
  where group_id = p_group and decided_at is not null and created_at > now() - interval '90 days';

  return jsonb_build_object(
    'members', jsonb_build_object(
      'total', (select count(*) from public.group_members where group_id = p_group),
      'joined_30d', (select count(*) from public.group_members where group_id = p_group and joined_at > now() - interval '30 days'),
      'left_30d', (select count(*) from public.group_activity_log
                   where group_id = p_group and action in ('member.left', 'member.removed') and created_at > now() - interval '30 days')
    ),
    'engagement', jsonb_build_object(
      'active_7d', (select count(distinct author_id) from public.group_messages
                    where group_id = p_group and author_id is not null and created_at > now() - interval '7 days'),
      'active_30d', (select count(distinct author_id) from public.group_messages
                     where group_id = p_group and author_id is not null and created_at > now() - interval '30 days'),
      'messages_per_week', (select jsonb_agg(jsonb_build_object('week', w, 'count', c) order by w)
                            from (select to_char(s.w, 'YYYY-MM-DD') as w,
                                         (select count(*) from public.group_messages m
                                          where m.group_id = p_group and m.kind = 'text'
                                            and m.created_at >= s.w and m.created_at < s.w + interval '7 days') as c
                                  from generate_series(date_trunc('week', now()) - interval '7 weeks',
                                                       date_trunc('week', now()), interval '1 week') as s(w)) x)
    ),
    'rides', jsonb_build_object(
      'upcoming', (select count(*) from public.group_rides where group_id = p_group and starts_at > now()),
      'past_90d', (select count(*) from public.group_rides where group_id = p_group and starts_at <= now() and starts_at > now() - interval '90 days'),
      'avg_participants', (select round(avg(n), 1) from (select count(p.user_id) as n from public.group_rides r
                           left join public.group_ride_participants p on p.ride_id = r.id
                           where r.group_id = p_group and r.starts_at > now() - interval '90 days' group by r.id) x),
      'outside_participants', (select count(*) from public.group_ride_participants p join public.group_rides r on r.id = p.ride_id
                               where r.group_id = p_group and r.starts_at > now() - interval '90 days'
                                 and not exists (select 1 from public.group_members m where m.group_id = p_group and m.user_id = p.user_id))
    ),
    'suggestions', jsonb_build_object(
      'received_30d', (select count(*) from public.group_suggestions where group_id = p_group and created_at > now() - interval '30 days'),
      'accepted_30d', (select count(*) from public.group_suggestions where group_id = p_group and created_at > now() - interval '30 days'
                       and status in ('accepted', 'accepted_edited')),
      'pending', (select count(*) from public.group_suggestions where group_id = p_group and status = 'pending' and expires_at > now()),
      'median_decision_hours', round((extract(epoch from v_decided) / 3600)::numeric, 1)
    ),
    'invites', jsonb_build_object(
      'sent_30d', (select count(*) from public.group_invites where group_id = p_group and created_at > now() - interval '30 days'),
      'accepted_30d', (select count(*) from public.group_invites where group_id = p_group and created_at > now() - interval '30 days' and status = 'accepted')
    )
  );
end;
$$;

-- Rétention du journal : 12 mois (pg_cron, service_role).
create or replace function public.purge_group_activity()
returns int
language sql
security definer
set search_path = ''
as $$
  with done as (delete from public.group_activity_log where created_at < now() - interval '12 months' returning 1)
  select count(*)::int from done;
$$;

-- -----------------------------------------------------------------------------
-- Storage : justificatifs de vérification (bucket privé, un dossier par groupe).
-- -----------------------------------------------------------------------------
do $$
begin
  if exists (select 1 from pg_namespace where nspname = 'storage') then
    insert into storage.buckets (id, name, public) values ('verification-docs', 'verification-docs', false)
    on conflict (id) do nothing;
    execute $p$
      create policy verification_docs_upload on storage.objects for insert to authenticated
      with check (bucket_id = 'verification-docs'
                  and public.is_founder_of_folder(split_part(name, '/', 1)))
    $p$;
    execute $p$
      create policy verification_docs_read on storage.objects for select to authenticated
      using (bucket_id = 'verification-docs'
             and (public.is_app_moderator() or public.is_founder_of_folder(split_part(name, '/', 1))))
    $p$;
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- Droits d'exécution
-- -----------------------------------------------------------------------------
revoke execute on function
  public.is_app_moderator(),
  public.is_valid_siret(text),
  public.is_founder_of_folder(text),
  public.has_feature(uuid, text),
  public.request_group_verification(uuid, text, text, text, text),
  public.pending_verifications(),
  public.decide_group_verification(uuid, boolean, text),
  public.revoke_group_verification(uuid, text),
  public.public_pro_rides(int),
  public.join_public_ride(uuid, boolean),
  public.group_stats(uuid),
  public.purge_group_activity()
from public, anon, authenticated;

grant execute on function
  public.is_app_moderator(),
  public.has_feature(uuid, text),
  public.request_group_verification(uuid, text, text, text, text),
  public.pending_verifications(),
  public.decide_group_verification(uuid, boolean, text),
  public.revoke_group_verification(uuid, text),
  public.public_pro_rides(int),
  public.join_public_ride(uuid, boolean),
  public.group_stats(uuid)
to authenticated;

-- Appelé par les politiques Storage (rôle authenticated) ; ne répond que pour soi.
grant execute on function public.is_founder_of_folder(text) to authenticated;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function public.purge_group_activity() to service_role;
  end if;
end $$;
