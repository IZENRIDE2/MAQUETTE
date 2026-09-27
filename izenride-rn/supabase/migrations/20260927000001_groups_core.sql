-- =============================================================================
-- IzenRide — Lot 1 : groupes, rôles personnalisables, membres, journal.
--
-- Principes :
--   * Toutes les tables sont en RLS, lecture réservée aux membres du groupe.
--   * Aucune écriture directe depuis le client : tout passe par les fonctions
--     RPC `security definer` ci-dessous, qui vérifient permissions et rangs.
--   * Un membre = exactement un rôle. Le rang (1..100) ordonne les rôles :
--     on n'agit jamais sur un rôle ou un membre de rang >= au sien.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Types
-- -----------------------------------------------------------------------------
create type public.group_kind as enum ('friends', 'pro');
create type public.group_plan as enum ('free', 'pro');

-- Catalogue fermé des permissions (miroir de src/api/permissions.ts).
create or replace function public.group_permission_catalog()
returns text[]
language sql
immutable
as $$
  select array[
    'ride.create',
    'member.invite',
    'member.remove',
    'member.assign_role',
    'content.announce',
    'content.moderate',
    'poll.create',
    'accept.ride',
    'accept.member',
    'accept.content',
    'accept.poll',
    'group.edit',
    'roles.manage',
    'insights.view'
  ]::text[];
$$;

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------
create table public.groups (
  id            uuid primary key default gen_random_uuid(),
  kind          public.group_kind not null default 'friends',
  name          text not null check (char_length(btrim(name)) between 2 and 60),
  photo_url     text,
  description   text check (char_length(description) <= 1000),
  rules         text check (char_length(rules) <= 2000),
  meeting_point text check (char_length(meeting_point) <= 200),
  plan          public.group_plan not null default 'free',
  verified_at   timestamptz,
  created_by    uuid not null references auth.users (id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.group_roles (
  id          uuid primary key default gen_random_uuid(),
  group_id    uuid not null references public.groups (id) on delete cascade,
  name        text not null check (char_length(btrim(name)) between 1 and 30),
  color       text not null default '#7a92b8' check (color ~ '^#[0-9a-fA-F]{6}$'),
  rank        int  not null check (rank between 1 and 100),
  permissions text[] not null default '{}'
              check (permissions <@ public.group_permission_catalog()),
  is_founder  boolean not null default false,
  -- Rôle attribué aux nouveaux membres et aux membres d'un rôle supprimé.
  is_default  boolean not null default false,
  created_at  timestamptz not null default now(),
  unique (group_id, name),
  unique (id, group_id),
  check (not (is_founder and is_default)),
  check (is_founder = (rank = 100))
);
create unique index group_roles_one_founder on public.group_roles (group_id) where is_founder;
create unique index group_roles_one_default on public.group_roles (group_id) where is_default;

create table public.group_members (
  group_id    uuid not null references public.groups (id) on delete cascade,
  user_id     uuid not null references auth.users (id) on delete cascade,
  role_id     uuid not null,
  joined_at   timestamptz not null default now(),
  muted_until timestamptz,
  invited_by  uuid references auth.users (id) on delete set null,
  primary key (group_id, user_id),
  -- Le rôle appartient forcément au même groupe.
  foreign key (role_id, group_id) references public.group_roles (id, group_id)
);
create index group_members_user on public.group_members (user_id);
create index group_members_role on public.group_members (role_id);

create table public.group_activity_log (
  id         bigint generated always as identity primary key,
  group_id   uuid not null references public.groups (id) on delete cascade,
  actor_id   uuid references auth.users (id) on delete set null,
  action     text not null,
  target     jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index group_activity_log_group on public.group_activity_log (group_id, created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger groups_touch_updated_at
  before update on public.groups
  for each row execute function public.touch_updated_at();

-- -----------------------------------------------------------------------------
-- Helpers de permission (security definer : lisent sans passer par la RLS,
-- ce qui évite toute récursion dans les politiques).
-- -----------------------------------------------------------------------------
create or replace function public.is_group_member(p_group uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.group_members m
    where m.group_id = p_group and m.user_id = auth.uid()
  );
$$;

-- Rang de l'utilisateur courant dans le groupe (null s'il n'est pas membre).
create or replace function public.group_member_rank(p_group uuid, p_user uuid default auth.uid())
returns int
language sql
stable
security definer
set search_path = ''
as $$
  select r.rank
  from public.group_members m
  join public.group_roles r on r.id = m.role_id
  where m.group_id = p_group and m.user_id = p_user;
$$;

-- Permissions effectives : le fondateur a tout le catalogue.
create or replace function public.group_member_permissions(p_group uuid, p_user uuid default auth.uid())
returns text[]
language sql
stable
security definer
set search_path = ''
as $$
  select case when r.is_founder then public.group_permission_catalog() else r.permissions end
  from public.group_members m
  join public.group_roles r on r.id = m.role_id
  where m.group_id = p_group and m.user_id = p_user;
$$;

create or replace function public.has_group_perm(p_group uuid, p_perm text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(p_perm = any (public.group_member_permissions(p_group)), false);
$$;

-- Lève une erreur explicite si la permission manque. Codes lus par l'app
-- (src/api/errors.ts) : not_authenticated, not_member, forbidden, rank_too_low…
create or replace function public.assert_group_perm(p_group uuid, p_perm text)
returns int
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_rank int;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  v_rank := public.group_member_rank(p_group);
  if v_rank is null then
    raise exception 'not_member' using errcode = '42501';
  end if;
  if p_perm is not null and not public.has_group_perm(p_group, p_perm) then
    raise exception 'forbidden' using errcode = '42501', detail = p_perm;
  end if;
  return v_rank;
end;
$$;

create or replace function public.log_group_activity(p_group uuid, p_action text, p_target jsonb default '{}'::jsonb)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.group_activity_log (group_id, actor_id, action, target)
  values (p_group, auth.uid(), p_action, coalesce(p_target, '{}'::jsonb));
$$;

-- -----------------------------------------------------------------------------
-- RLS : lecture pour les membres, aucune écriture directe.
-- -----------------------------------------------------------------------------
alter table public.groups             enable row level security;
alter table public.group_roles        enable row level security;
alter table public.group_members      enable row level security;
alter table public.group_activity_log enable row level security;

create policy groups_select on public.groups
  for select to authenticated using (public.is_group_member(id));

create policy group_roles_select on public.group_roles
  for select to authenticated using (public.is_group_member(group_id));

create policy group_members_select on public.group_members
  for select to authenticated using (public.is_group_member(group_id));

create policy group_activity_log_select on public.group_activity_log
  for select to authenticated using (public.has_group_perm(group_id, 'insights.view'));

-- -----------------------------------------------------------------------------
-- RPC : lecture
-- -----------------------------------------------------------------------------

-- Groupes de l'utilisateur courant, avec son rôle et ses permissions effectives.
create or replace function public.my_groups()
returns table (
  id           uuid,
  kind         public.group_kind,
  name         text,
  photo_url    text,
  plan         public.group_plan,
  verified_at  timestamptz,
  member_count int,
  role_id      uuid,
  role_name    text,
  role_rank    int,
  role_color   text,
  permissions  text[],
  joined_at    timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select g.id, g.kind, g.name, g.photo_url, g.plan, g.verified_at,
         (select count(*)::int from public.group_members x where x.group_id = g.id),
         r.id, r.name, r.rank, r.color,
         case when r.is_founder then public.group_permission_catalog() else r.permissions end,
         m.joined_at
  from public.group_members m
  join public.groups g      on g.id = m.group_id
  join public.group_roles r on r.id = m.role_id
  where m.user_id = auth.uid()
  order by m.joined_at desc;
$$;

-- -----------------------------------------------------------------------------
-- RPC : groupe
-- -----------------------------------------------------------------------------
create or replace function public.create_group(
  p_kind        public.group_kind,
  p_name        text,
  p_description text default null,
  p_photo_url   text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid     uuid := auth.uid();
  v_group   uuid;
  v_founder uuid;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  insert into public.groups (kind, name, description, photo_url, created_by)
  values (p_kind, btrim(p_name), nullif(btrim(p_description), ''), p_photo_url, v_uid)
  returning id into v_group;

  insert into public.group_roles (group_id, name, color, rank, permissions, is_founder)
  values (v_group, 'Fondateur', '#fbbf24', 100, '{}', true)
  returning id into v_founder;

  insert into public.group_roles (group_id, name, color, rank, permissions)
  values (v_group, 'Admin', '#7eb0ff', 80,
          array_remove(public.group_permission_catalog(), 'roles.manage'));

  if p_kind = 'pro' then
    insert into public.group_roles (group_id, name, color, rank, permissions)
    values (v_group, 'Gestionnaire', '#22d3ee', 50,
            array_remove(array_remove(public.group_permission_catalog(), 'roles.manage'), 'member.remove'));
  else
    insert into public.group_roles (group_id, name, color, rank, permissions)
    values (v_group, 'Road captain', '#22d3ee', 50,
            array['ride.create', 'poll.create', 'accept.ride', 'accept.poll']);
  end if;

  insert into public.group_roles (group_id, name, color, rank, permissions, is_default)
  values (v_group, 'Membre', '#7a92b8', 10, '{}', true);

  insert into public.group_members (group_id, user_id, role_id)
  values (v_group, v_uid, v_founder);

  perform public.log_group_activity(v_group, 'group.created', jsonb_build_object('name', btrim(p_name)));
  return v_group;
end;
$$;

-- Mise à jour partielle : seules les clés présentes dans p_patch sont appliquées.
create or replace function public.update_group(p_group uuid, p_patch jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.assert_group_perm(p_group, 'group.edit');

  update public.groups set
    name          = case when p_patch ? 'name'          then btrim(p_patch ->> 'name') else name end,
    description   = case when p_patch ? 'description'   then nullif(btrim(p_patch ->> 'description'), '') else description end,
    rules         = case when p_patch ? 'rules'         then nullif(btrim(p_patch ->> 'rules'), '') else rules end,
    meeting_point = case when p_patch ? 'meeting_point' then nullif(btrim(p_patch ->> 'meeting_point'), '') else meeting_point end,
    photo_url     = case when p_patch ? 'photo_url'     then nullif(p_patch ->> 'photo_url', '') else photo_url end
  where id = p_group;

  perform public.log_group_activity(p_group, 'group.updated',
    jsonb_build_object('fields', (select coalesce(jsonb_agg(k), '[]'::jsonb) from jsonb_object_keys(p_patch) k)));
end;
$$;

create or replace function public.delete_group(p_group uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.assert_group_perm(p_group, null) <> 100 then
    raise exception 'founder_only' using errcode = '42501';
  end if;
  delete from public.groups where id = p_group;
end;
$$;

-- -----------------------------------------------------------------------------
-- RPC : rôles
-- -----------------------------------------------------------------------------

-- Crée (p_role null) ou modifie un rôle. Rang strictement inférieur au sien.
create or replace function public.upsert_role(
  p_group       uuid,
  p_role        uuid,
  p_name        text,
  p_color       text,
  p_rank        int,
  p_permissions text[]
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_my_rank int;
  v_role    public.group_roles;
  v_id      uuid;
begin
  v_my_rank := public.assert_group_perm(p_group, 'roles.manage');

  if p_rank is null or p_rank < 1 or p_rank >= v_my_rank then
    raise exception 'rank_too_high' using errcode = '42501';
  end if;
  if not (coalesce(p_permissions, '{}') <@ public.group_permission_catalog()) then
    raise exception 'unknown_permission' using errcode = '22023';
  end if;

  if p_role is null then
    insert into public.group_roles (group_id, name, color, rank, permissions)
    values (p_group, btrim(p_name), p_color, p_rank, coalesce(p_permissions, '{}'))
    returning id into v_id;
    perform public.log_group_activity(p_group, 'role.created', jsonb_build_object('role_id', v_id, 'name', btrim(p_name)));
    return v_id;
  end if;

  select * into v_role from public.group_roles where id = p_role and group_id = p_group for update;
  if not found then
    raise exception 'role_not_found' using errcode = 'P0002';
  end if;
  if v_role.is_founder or v_role.rank >= v_my_rank then
    raise exception 'rank_too_high' using errcode = '42501';
  end if;

  update public.group_roles
  set name = btrim(p_name), color = p_color, rank = p_rank, permissions = coalesce(p_permissions, '{}')
  where id = p_role;

  perform public.log_group_activity(p_group, 'role.updated', jsonb_build_object('role_id', p_role, 'name', btrim(p_name)));
  return p_role;
end;
$$;

-- Supprime un rôle ; ses membres basculent sur le rôle par défaut.
create or replace function public.delete_role(p_role uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_role    public.group_roles;
  v_my_rank int;
  v_default uuid;
  v_moved   int;
begin
  select * into v_role from public.group_roles where id = p_role for update;
  if not found then
    raise exception 'role_not_found' using errcode = 'P0002';
  end if;
  v_my_rank := public.assert_group_perm(v_role.group_id, 'roles.manage');
  if v_role.is_founder or v_role.rank >= v_my_rank then
    raise exception 'rank_too_high' using errcode = '42501';
  end if;
  if v_role.is_default then
    raise exception 'default_role_locked' using errcode = '42501';
  end if;

  select id into v_default from public.group_roles where group_id = v_role.group_id and is_default;
  update public.group_members set role_id = v_default where role_id = p_role;
  get diagnostics v_moved = row_count;
  delete from public.group_roles where id = p_role;

  perform public.log_group_activity(v_role.group_id, 'role.deleted',
    jsonb_build_object('role_id', p_role, 'name', v_role.name, 'members_moved', v_moved));
end;
$$;

-- Réordonne des rôles (du plus haut au plus bas) en permutant leurs rangs
-- actuels : les rangs restent donc tous sous celui de l'appelant.
create or replace function public.reorder_roles(p_group uuid, p_ordered uuid[])
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_my_rank int;
  v_ranks   int[];
  v_count   int;
  i         int;
begin
  v_my_rank := public.assert_group_perm(p_group, 'roles.manage');

  select count(*), array_agg(rank order by rank desc)
  into v_count, v_ranks
  from public.group_roles
  where group_id = p_group and id = any (p_ordered) and not is_founder and rank < v_my_rank;

  if v_count <> coalesce(array_length(p_ordered, 1), 0)
     or v_count <> (select count(distinct x) from unnest(p_ordered) x) then
    raise exception 'rank_too_high' using errcode = '42501';
  end if;

  for i in 1 .. v_count loop
    update public.group_roles set rank = v_ranks[i] where id = p_ordered[i];
  end loop;

  perform public.log_group_activity(p_group, 'roles.reordered', jsonb_build_object('order', to_jsonb(p_ordered)));
end;
$$;

-- -----------------------------------------------------------------------------
-- RPC : membres
-- -----------------------------------------------------------------------------
create or replace function public.assign_role(p_group uuid, p_user uuid, p_role uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_my_rank     int;
  v_target_rank int;
  v_role        public.group_roles;
begin
  v_my_rank := public.assert_group_perm(p_group, 'member.assign_role');
  v_target_rank := public.group_member_rank(p_group, p_user);
  if v_target_rank is null then
    raise exception 'member_not_found' using errcode = 'P0002';
  end if;
  select * into v_role from public.group_roles where id = p_role and group_id = p_group;
  if not found then
    raise exception 'role_not_found' using errcode = 'P0002';
  end if;
  if p_user = auth.uid() or v_target_rank >= v_my_rank or v_role.rank >= v_my_rank or v_role.is_founder then
    raise exception 'rank_too_high' using errcode = '42501';
  end if;

  update public.group_members set role_id = p_role where group_id = p_group and user_id = p_user;
  perform public.log_group_activity(p_group, 'member.role_changed',
    jsonb_build_object('user_id', p_user, 'role_id', p_role, 'role_name', v_role.name));
end;
$$;

create or replace function public.remove_member(p_group uuid, p_user uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_my_rank     int;
  v_target_rank int;
begin
  v_my_rank := public.assert_group_perm(p_group, 'member.remove');
  v_target_rank := public.group_member_rank(p_group, p_user);
  if v_target_rank is null then
    raise exception 'member_not_found' using errcode = 'P0002';
  end if;
  if p_user = auth.uid() or v_target_rank >= v_my_rank then
    raise exception 'rank_too_high' using errcode = '42501';
  end if;

  delete from public.group_members where group_id = p_group and user_id = p_user;
  perform public.log_group_activity(p_group, 'member.removed', jsonb_build_object('user_id', p_user));
end;
$$;

-- p_until null = fin de la sourdine.
create or replace function public.mute_member(p_group uuid, p_user uuid, p_until timestamptz)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_my_rank     int;
  v_target_rank int;
begin
  v_my_rank := public.assert_group_perm(p_group, 'member.remove');
  v_target_rank := public.group_member_rank(p_group, p_user);
  if v_target_rank is null then
    raise exception 'member_not_found' using errcode = 'P0002';
  end if;
  if p_user = auth.uid() or v_target_rank >= v_my_rank then
    raise exception 'rank_too_high' using errcode = '42501';
  end if;

  update public.group_members set muted_until = p_until where group_id = p_group and user_id = p_user;
  perform public.log_group_activity(p_group,
    case when p_until is null then 'member.unmuted' else 'member.muted' end,
    jsonb_build_object('user_id', p_user, 'until', p_until));
end;
$$;

-- Le fondateur ne peut partir qu'après avoir transféré son rôle,
-- sauf s'il est seul : le groupe est alors supprimé.
create or replace function public.leave_group(p_group uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_rank  int;
  v_count int;
begin
  v_rank := public.assert_group_perm(p_group, null);
  if v_rank = 100 then
    select count(*) into v_count from public.group_members where group_id = p_group;
    if v_count > 1 then
      raise exception 'transfer_founder_first' using errcode = '42501';
    end if;
    delete from public.groups where id = p_group;
    return;
  end if;

  delete from public.group_members where group_id = p_group and user_id = auth.uid();
  perform public.log_group_activity(p_group, 'member.left', jsonb_build_object('user_id', auth.uid()));
end;
$$;

-- Transfère le rôle de fondateur ; l'ancien fondateur prend le rôle
-- non fondateur de plus haut rang.
create or replace function public.transfer_founder(p_group uuid, p_new_founder uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_founder_role uuid;
  v_next_role    uuid;
begin
  if public.assert_group_perm(p_group, null) <> 100 then
    raise exception 'founder_only' using errcode = '42501';
  end if;
  if p_new_founder = auth.uid() or public.group_member_rank(p_group, p_new_founder) is null then
    raise exception 'member_not_found' using errcode = 'P0002';
  end if;

  select id into v_founder_role from public.group_roles where group_id = p_group and is_founder;
  select id into v_next_role from public.group_roles
  where group_id = p_group and not is_founder
  order by rank desc
  limit 1;

  update public.group_members set role_id = v_next_role where group_id = p_group and user_id = auth.uid();
  update public.group_members set role_id = v_founder_role where group_id = p_group and user_id = p_new_founder;

  perform public.log_group_activity(p_group, 'founder.transferred', jsonb_build_object('user_id', p_new_founder));
end;
$$;

-- -----------------------------------------------------------------------------
-- Droits d'exécution. Postgres (et Supabase) accordent EXECUTE par défaut :
-- on retire tout sur les fonctions de ce lot, puis on ouvre la liste
-- appelable par les utilisateurs connectés. Les helpers internes (journal,
-- assertions, rangs d'un tiers) ne restent appelables que depuis les RPC.
-- -----------------------------------------------------------------------------
revoke execute on function
  public.group_permission_catalog(),
  public.touch_updated_at(),
  public.is_group_member(uuid),
  public.group_member_rank(uuid, uuid),
  public.group_member_permissions(uuid, uuid),
  public.has_group_perm(uuid, text),
  public.assert_group_perm(uuid, text),
  public.log_group_activity(uuid, text, jsonb),
  public.my_groups(),
  public.create_group(public.group_kind, text, text, text),
  public.update_group(uuid, jsonb),
  public.delete_group(uuid),
  public.upsert_role(uuid, uuid, text, text, int, text[]),
  public.delete_role(uuid),
  public.reorder_roles(uuid, uuid[]),
  public.assign_role(uuid, uuid, uuid),
  public.remove_member(uuid, uuid),
  public.mute_member(uuid, uuid, timestamptz),
  public.leave_group(uuid),
  public.transfer_founder(uuid, uuid)
from public, anon, authenticated;

grant execute on function
  public.group_permission_catalog(),
  public.is_group_member(uuid),
  public.has_group_perm(uuid, text),
  public.my_groups(),
  public.create_group(public.group_kind, text, text, text),
  public.update_group(uuid, jsonb),
  public.delete_group(uuid),
  public.upsert_role(uuid, uuid, text, text, int, text[]),
  public.delete_role(uuid),
  public.reorder_roles(uuid, uuid[]),
  public.assign_role(uuid, uuid, uuid),
  public.remove_member(uuid, uuid),
  public.mute_member(uuid, uuid, timestamptz),
  public.leave_group(uuid),
  public.transfer_founder(uuid, uuid)
to authenticated;

grant select on public.groups, public.group_roles, public.group_members, public.group_activity_log to authenticated;
