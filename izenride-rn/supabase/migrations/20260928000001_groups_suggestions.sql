-- =============================================================================
-- IzenRide — Lot 2 : suggestions 1 clic, chat, sorties, sondages, annonces,
-- invitations dans un groupe, préférences de notification.
--
-- Principe central : `group_action` fait la même chose pour tout le monde.
-- Avec la permission directe, l'action est appliquée ; sans, elle devient une
-- suggestion qu'un habilité accepte (éventuellement modifiée) en 1 clic via
-- `decide_suggestion`. Le premier qui décide gagne (verrou de ligne).
-- =============================================================================

create type public.suggestion_type as enum ('ride', 'member', 'announcement', 'poll');
create type public.suggestion_status as enum ('pending', 'accepted', 'accepted_edited', 'refused', 'withdrawn', 'expired');

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

-- Fil du chat. Les cartes (suggestion, sortie, sondage, annonce, invitation)
-- pointent vers leur objet via ref_id ; l'app lit l'état à jour de l'objet.
create table public.group_messages (
  id         uuid primary key default gen_random_uuid(),
  group_id   uuid not null references public.groups (id) on delete cascade,
  author_id  uuid references auth.users (id) on delete set null,
  kind       text not null check (kind in ('text', 'suggestion', 'ride', 'poll', 'announcement', 'invite', 'system')),
  body       text check (char_length(body) <= 2000),
  ref_id     uuid,
  created_at timestamptz not null default now()
);
create index group_messages_group on public.group_messages (group_id, created_at desc);

create table public.group_suggestions (
  id             uuid primary key default gen_random_uuid(),
  group_id       uuid not null references public.groups (id) on delete cascade,
  author_id      uuid not null references auth.users (id) on delete cascade,
  type           public.suggestion_type not null,
  payload        jsonb not null,
  status         public.suggestion_status not null default 'pending',
  decided_by     uuid references auth.users (id) on delete set null,
  decided_at     timestamptz,
  edited_payload jsonb,
  refusal_reason text check (char_length(refusal_reason) <= 200),
  result_id      uuid,
  expires_at     timestamptz not null,
  created_at     timestamptz not null default now()
);
create index group_suggestions_group on public.group_suggestions (group_id, status, created_at);
create index group_suggestions_author on public.group_suggestions (author_id, created_at desc);

-- Les 👍 des membres : indicatifs, sans valeur de vote.
create table public.group_suggestion_votes (
  suggestion_id uuid not null references public.group_suggestions (id) on delete cascade,
  user_id       uuid not null references auth.users (id) on delete cascade,
  primary key (suggestion_id, user_id)
);

create table public.group_rides (
  id                 uuid primary key default gen_random_uuid(),
  group_id           uuid not null references public.groups (id) on delete cascade,
  title              text not null,
  starts_at          timestamptz not null,
  meeting_point      text not null,
  route              text,
  level              text not null default 'tous' check (level in ('tous', 'intermediaire', 'confirme')),
  -- Groupe d'amis : toujours true. Groupe pro : false = promue dans Événements (lot 4).
  members_only       boolean not null default true,
  event_id           uuid,
  created_by         uuid references auth.users (id) on delete set null,
  from_suggestion_id uuid references public.group_suggestions (id) on delete set null,
  created_at         timestamptz not null default now()
);
create index group_rides_group on public.group_rides (group_id, starts_at);

create table public.group_ride_participants (
  ride_id   uuid not null references public.group_rides (id) on delete cascade,
  user_id   uuid not null references auth.users (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (ride_id, user_id)
);

create table public.group_polls (
  id                 uuid primary key default gen_random_uuid(),
  group_id           uuid not null references public.groups (id) on delete cascade,
  question           text not null,
  options            text[] not null check (cardinality(options) between 2 and 6),
  ends_at            timestamptz,
  created_by         uuid references auth.users (id) on delete set null,
  from_suggestion_id uuid references public.group_suggestions (id) on delete set null,
  created_at         timestamptz not null default now()
);

create table public.group_poll_votes (
  poll_id      uuid not null references public.group_polls (id) on delete cascade,
  user_id      uuid not null references auth.users (id) on delete cascade,
  option_index int  not null check (option_index >= 0),
  voted_at     timestamptz not null default now(),
  primary key (poll_id, user_id)
);

create table public.group_announcements (
  id                 uuid primary key default gen_random_uuid(),
  group_id           uuid not null references public.groups (id) on delete cascade,
  body               text not null,
  pinned_until       timestamptz,
  author_id          uuid references auth.users (id) on delete set null,
  from_suggestion_id uuid references public.group_suggestions (id) on delete set null,
  created_at         timestamptz not null default now()
);
create index group_announcements_group on public.group_announcements (group_id, pinned_until desc);

create table public.group_invites (
  id                uuid primary key default gen_random_uuid(),
  group_id          uuid not null references public.groups (id) on delete cascade,
  invitee_id        uuid not null references auth.users (id) on delete cascade,
  invited_by        uuid references auth.users (id) on delete set null,
  intro             text check (char_length(intro) <= 200),
  status            text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  via_suggestion_id uuid references public.group_suggestions (id) on delete set null,
  created_at        timestamptz not null default now(),
  responded_at      timestamptz
);
create unique index group_invites_one_pending on public.group_invites (group_id, invitee_id) where status = 'pending';
create index group_invites_invitee on public.group_invites (invitee_id, status);

-- group_id null = réglage global. suggestions_push : être notifié des
-- suggestions à valider ; outcome_push : de l'issue de ses propres suggestions.
create table public.notification_prefs (
  user_id          uuid not null references auth.users (id) on delete cascade,
  group_id         uuid references public.groups (id) on delete cascade,
  suggestions_push boolean not null default true,
  outcome_push     boolean not null default true,
  updated_at       timestamptz not null default now()
);
create unique index notification_prefs_scope
  on public.notification_prefs (user_id, coalesce(group_id, '00000000-0000-0000-0000-000000000000'::uuid));

create table public.user_push_tokens (
  token      text primary key,
  user_id    uuid not null references auth.users (id) on delete cascade,
  platform   text not null check (platform in ('ios', 'android')),
  updated_at timestamptz not null default now()
);
create index user_push_tokens_user on public.user_push_tokens (user_id);

-- -----------------------------------------------------------------------------
-- RLS : lecture par les membres du groupe, écriture via RPC uniquement.
-- -----------------------------------------------------------------------------
alter table public.group_messages          enable row level security;
alter table public.group_suggestions       enable row level security;
alter table public.group_suggestion_votes  enable row level security;
alter table public.group_rides             enable row level security;
alter table public.group_ride_participants enable row level security;
alter table public.group_polls             enable row level security;
alter table public.group_poll_votes        enable row level security;
alter table public.group_announcements     enable row level security;
alter table public.group_invites           enable row level security;
alter table public.notification_prefs      enable row level security;
alter table public.user_push_tokens        enable row level security;

create policy group_messages_select on public.group_messages
  for select to authenticated using (public.is_group_member(group_id));
create policy group_suggestions_select on public.group_suggestions
  for select to authenticated using (public.is_group_member(group_id));
create policy group_suggestion_votes_select on public.group_suggestion_votes
  for select to authenticated using (
    public.is_group_member((select s.group_id from public.group_suggestions s where s.id = suggestion_id)));
create policy group_rides_select on public.group_rides
  for select to authenticated using (public.is_group_member(group_id));
create policy group_ride_participants_select on public.group_ride_participants
  for select to authenticated using (
    public.is_group_member((select r.group_id from public.group_rides r where r.id = ride_id)));
create policy group_polls_select on public.group_polls
  for select to authenticated using (public.is_group_member(group_id));
create policy group_poll_votes_select on public.group_poll_votes
  for select to authenticated using (
    public.is_group_member((select p.group_id from public.group_polls p where p.id = poll_id)));
create policy group_announcements_select on public.group_announcements
  for select to authenticated using (public.is_group_member(group_id));
create policy group_invites_select on public.group_invites
  for select to authenticated using (invitee_id = auth.uid() or public.is_group_member(group_id));
create policy notification_prefs_select on public.notification_prefs
  for select to authenticated using (user_id = auth.uid());

grant select on
  public.group_messages, public.group_suggestions, public.group_suggestion_votes,
  public.group_rides, public.group_ride_participants, public.group_polls,
  public.group_poll_votes, public.group_announcements, public.group_invites,
  public.notification_prefs
to authenticated;

-- -----------------------------------------------------------------------------
-- Correspondance type -> permissions
-- -----------------------------------------------------------------------------
create or replace function public.suggestion_direct_perm(p_type public.suggestion_type)
returns text
language sql
immutable
as $$
  select case p_type
    when 'ride' then 'ride.create'
    when 'member' then 'member.invite'
    when 'announcement' then 'content.announce'
    when 'poll' then 'poll.create'
  end;
$$;

create or replace function public.suggestion_accept_perm(p_type public.suggestion_type)
returns text
language sql
immutable
as $$
  select case p_type
    when 'ride' then 'accept.ride'
    when 'member' then 'accept.member'
    when 'announcement' then 'accept.content'
    when 'poll' then 'accept.poll'
  end;
$$;

-- -----------------------------------------------------------------------------
-- Validation et normalisation des contenus (communes aux créations directes,
-- aux suggestions et aux suggestions modifiées avant acceptation).
-- -----------------------------------------------------------------------------
create or replace function public.normalize_group_payload(p_group uuid, p_type public.suggestion_type, p jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_kind    public.group_kind;
  v_text    text;
  v_ts      timestamptz;
  v_user    uuid;
  v_int     int;
  v_opts    text[];
begin
  if p is null or jsonb_typeof(p) <> 'object' then
    raise exception 'invalid_payload' using errcode = '22023';
  end if;
  select kind into v_kind from public.groups where id = p_group;

  begin
    case p_type
    when 'ride' then
      v_text := btrim(p ->> 'title');
      if v_text is null or char_length(v_text) not between 2 and 80 then
        raise exception 'invalid_payload' using detail = 'title';
      end if;
      v_ts := (p ->> 'starts_at')::timestamptz;
      if v_ts is null or v_ts <= now() then
        raise exception 'invalid_payload' using detail = 'starts_at';
      end if;
      if char_length(coalesce(btrim(p ->> 'meeting_point'), '')) not between 2 and 200 then
        raise exception 'invalid_payload' using detail = 'meeting_point';
      end if;
      if char_length(coalesce(p ->> 'route', '')) > 500 then
        raise exception 'invalid_payload' using detail = 'route';
      end if;
      if coalesce(p ->> 'level', 'tous') not in ('tous', 'intermediaire', 'confirme') then
        raise exception 'invalid_payload' using detail = 'level';
      end if;
      return jsonb_build_object(
        'title', v_text,
        'starts_at', v_ts,
        'meeting_point', btrim(p ->> 'meeting_point'),
        'route', nullif(btrim(coalesce(p ->> 'route', '')), ''),
        'level', coalesce(p ->> 'level', 'tous'),
        -- Seul un groupe pro peut publier une sortie hors du groupe.
        'members_only', case when v_kind = 'pro' then coalesce((p ->> 'members_only')::boolean, false) else true end
      );

    when 'member' then
      v_user := (p ->> 'user_id')::uuid;
      if v_user is null or not exists (select 1 from auth.users u where u.id = v_user) then
        raise exception 'invalid_payload' using detail = 'user_id';
      end if;
      if exists (select 1 from public.group_members m where m.group_id = p_group and m.user_id = v_user) then
        raise exception 'already_member' using errcode = '23505';
      end if;
      if exists (select 1 from public.group_invites i where i.group_id = p_group and i.invitee_id = v_user and i.status = 'pending') then
        raise exception 'already_invited' using errcode = '23505';
      end if;
      if char_length(coalesce(p ->> 'intro', '')) > 200 then
        raise exception 'invalid_payload' using detail = 'intro';
      end if;
      return jsonb_build_object('user_id', v_user, 'intro', nullif(btrim(coalesce(p ->> 'intro', '')), ''));

    when 'announcement' then
      v_text := btrim(p ->> 'body');
      if v_text is null or char_length(v_text) not between 1 and 1000 then
        raise exception 'invalid_payload' using detail = 'body';
      end if;
      v_int := coalesce((p ->> 'pin_days')::int, 7);
      if v_int not between 0 and 30 then
        raise exception 'invalid_payload' using detail = 'pin_days';
      end if;
      return jsonb_build_object('body', v_text, 'pin_days', v_int);

    when 'poll' then
      v_text := btrim(p ->> 'question');
      if v_text is null or char_length(v_text) not between 3 and 200 then
        raise exception 'invalid_payload' using detail = 'question';
      end if;
      if jsonb_typeof(p -> 'options') <> 'array' then
        raise exception 'invalid_payload' using detail = 'options';
      end if;
      select array_agg(btrim(o) order by n) into v_opts
      from jsonb_array_elements_text(p -> 'options') with ordinality as t(o, n)
      where btrim(o) <> '';
      if cardinality(v_opts) not between 2 and 6
         or exists (select 1 from unnest(v_opts) o where char_length(o) > 80)
         or (select count(distinct lower(o)) from unnest(v_opts) o) <> cardinality(v_opts) then
        raise exception 'invalid_payload' using detail = 'options';
      end if;
      v_ts := (p ->> 'ends_at')::timestamptz;
      if v_ts is not null and v_ts <= now() then
        raise exception 'invalid_payload' using detail = 'ends_at';
      end if;
      return jsonb_build_object('question', v_text, 'options', to_jsonb(v_opts), 'ends_at', v_ts);
    end case;
  exception
    -- Conversions impossibles (date, uuid, entier…) : même code métier.
    when invalid_text_representation or invalid_datetime_format or datetime_field_overflow
         or numeric_value_out_of_range then
      raise exception 'invalid_payload' using errcode = '22023';
  end;
end;
$$;

-- -----------------------------------------------------------------------------
-- Application d'un contenu validé (interne : jamais appelable par le client).
-- -----------------------------------------------------------------------------
create or replace function public.apply_group_payload(
  p_group      uuid,
  p_type       public.suggestion_type,
  p            jsonb,
  p_author     uuid,
  p_suggestion uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  case p_type
  when 'ride' then
    insert into public.group_rides (group_id, title, starts_at, meeting_point, route, level, members_only, created_by, from_suggestion_id)
    values (p_group, p ->> 'title', (p ->> 'starts_at')::timestamptz, p ->> 'meeting_point', p ->> 'route',
            p ->> 'level', (p ->> 'members_only')::boolean, p_author, p_suggestion)
    returning id into v_id;
    insert into public.group_ride_participants (ride_id, user_id) values (v_id, p_author);

  when 'poll' then
    insert into public.group_polls (group_id, question, options, ends_at, created_by, from_suggestion_id)
    values (p_group, p ->> 'question', array(select jsonb_array_elements_text(p -> 'options')),
            (p ->> 'ends_at')::timestamptz, p_author, p_suggestion)
    returning id into v_id;

  when 'announcement' then
    insert into public.group_announcements (group_id, body, pinned_until, author_id, from_suggestion_id)
    values (p_group, p ->> 'body',
            case when (p ->> 'pin_days')::int > 0 then now() + make_interval(days => (p ->> 'pin_days')::int) end,
            p_author, p_suggestion)
    returning id into v_id;

  when 'member' then
    insert into public.group_invites (group_id, invitee_id, invited_by, intro, via_suggestion_id)
    values (p_group, (p ->> 'user_id')::uuid, p_author, p ->> 'intro', p_suggestion)
    returning id into v_id;
  end case;

  insert into public.group_messages (group_id, author_id, kind, ref_id)
  values (p_group, p_author,
          case p_type when 'member' then 'invite' else p_type::text end,
          v_id);
  perform public.log_group_activity(p_group, p_type::text || '.created',
    jsonb_build_object('id', v_id, 'author_id', p_author, 'suggestion_id', p_suggestion));
  return v_id;
end;
$$;

-- -----------------------------------------------------------------------------
-- RPC : action unifiée « créer ou proposer »
-- -----------------------------------------------------------------------------
create or replace function public.group_action(p_group uuid, p_type public.suggestion_type, p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid     uuid := auth.uid();
  v_payload jsonb;
  v_id      uuid;
  v_pending int;
  v_expires timestamptz;
begin
  perform public.assert_group_perm(p_group, null);
  v_payload := public.normalize_group_payload(p_group, p_type, p_payload);

  if public.has_group_perm(p_group, public.suggestion_direct_perm(p_type)) then
    v_id := public.apply_group_payload(p_group, p_type, v_payload, v_uid, null);
    return jsonb_build_object('mode', 'created', 'id', v_id);
  end if;

  select count(*) into v_pending
  from public.group_suggestions
  where group_id = p_group and author_id = v_uid and status = 'pending' and expires_at > now();
  if v_pending >= 5 then
    raise exception 'too_many_pending' using errcode = '54000';
  end if;

  v_expires := now() + interval '14 days';
  if p_type = 'ride' then
    v_expires := least(v_expires, (v_payload ->> 'starts_at')::timestamptz);
  end if;

  insert into public.group_suggestions (group_id, author_id, type, payload, expires_at)
  values (p_group, v_uid, p_type, v_payload, v_expires)
  returning id into v_id;

  insert into public.group_messages (group_id, author_id, kind, ref_id)
  values (p_group, v_uid, 'suggestion', v_id);

  return jsonb_build_object('mode', 'suggested', 'id', v_id);
end;
$$;

-- -----------------------------------------------------------------------------
-- RPC : décision en 1 clic (accepter, accepter modifié, refuser)
-- -----------------------------------------------------------------------------
create or replace function public.decide_suggestion(
  p_suggestion uuid,
  p_accept     boolean,
  p_edited     jsonb default null,
  p_reason     text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_s       public.group_suggestions;
  v_final   jsonb;
  v_result  uuid;
  v_status  public.suggestion_status;
begin
  select * into v_s from public.group_suggestions where id = p_suggestion for update;
  if not found then
    raise exception 'suggestion_not_found' using errcode = 'P0002';
  end if;
  perform public.assert_group_perm(v_s.group_id, public.suggestion_accept_perm(v_s.type));

  if v_s.status <> 'pending' then
    raise exception 'already_decided' using errcode = '40001', detail = coalesce(v_s.decided_by::text, '');
  end if;
  if v_s.expires_at <= now() then
    update public.group_suggestions set status = 'expired' where id = p_suggestion;
    return jsonb_build_object('status', 'expired');
  end if;

  if p_accept then
    v_final := public.normalize_group_payload(v_s.group_id, v_s.type, coalesce(p_edited, v_s.payload));
    v_result := public.apply_group_payload(v_s.group_id, v_s.type, v_final, v_s.author_id, v_s.id);
    v_status := case when p_edited is null then 'accepted' else 'accepted_edited' end;
    update public.group_suggestions
    set status = v_status, decided_by = auth.uid(), decided_at = now(),
        edited_payload = case when p_edited is null then null else v_final end,
        result_id = v_result
    where id = p_suggestion;
  else
    if char_length(coalesce(btrim(p_reason), '')) not between 1 and 200 then
      raise exception 'reason_required' using errcode = '22023';
    end if;
    v_status := 'refused';
    update public.group_suggestions
    set status = v_status, decided_by = auth.uid(), decided_at = now(), refusal_reason = btrim(p_reason)
    where id = p_suggestion;
  end if;

  perform public.log_group_activity(v_s.group_id, 'suggestion.' || v_status::text,
    jsonb_build_object('suggestion_id', v_s.id, 'type', v_s.type, 'author_id', v_s.author_id));
  return jsonb_build_object('status', v_status, 'result_id', v_result);
end;
$$;

create or replace function public.withdraw_suggestion(p_suggestion uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.group_suggestions
  set status = 'withdrawn'
  where id = p_suggestion and author_id = auth.uid() and status = 'pending';
  if not found then
    raise exception 'suggestion_not_found' using errcode = 'P0002';
  end if;
end;
$$;

-- Bascule le 👍 de l'utilisateur ; renvoie le nouveau total.
create or replace function public.toggle_suggestion_vote(p_suggestion uuid)
returns int
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_group uuid;
begin
  select group_id into v_group from public.group_suggestions where id = p_suggestion and status = 'pending';
  if not found then
    raise exception 'suggestion_not_found' using errcode = 'P0002';
  end if;
  perform public.assert_group_perm(v_group, null);

  delete from public.group_suggestion_votes where suggestion_id = p_suggestion and user_id = auth.uid();
  if not found then
    insert into public.group_suggestion_votes (suggestion_id, user_id) values (p_suggestion, auth.uid());
  end if;
  return (select count(*)::int from public.group_suggestion_votes where suggestion_id = p_suggestion);
end;
$$;

-- -----------------------------------------------------------------------------
-- RPC : chat, sorties, sondages, invitations
-- -----------------------------------------------------------------------------
create or replace function public.post_message(p_group uuid, p_body text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  perform public.assert_group_perm(p_group, null);
  if exists (select 1 from public.group_members
             where group_id = p_group and user_id = auth.uid() and muted_until > now()) then
    raise exception 'muted' using errcode = '42501';
  end if;
  if char_length(coalesce(btrim(p_body), '')) not between 1 and 2000 then
    raise exception 'invalid_payload' using errcode = '22023';
  end if;
  insert into public.group_messages (group_id, author_id, kind, body)
  values (p_group, auth.uid(), 'text', btrim(p_body))
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.set_ride_participation(p_ride uuid, p_join boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_group uuid;
begin
  select group_id into v_group from public.group_rides where id = p_ride;
  if not found then
    raise exception 'ride_not_found' using errcode = 'P0002';
  end if;
  perform public.assert_group_perm(v_group, null);
  if p_join then
    insert into public.group_ride_participants (ride_id, user_id) values (p_ride, auth.uid())
    on conflict do nothing;
  else
    delete from public.group_ride_participants where ride_id = p_ride and user_id = auth.uid();
  end if;
end;
$$;

create or replace function public.vote_poll(p_poll uuid, p_option int)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_poll public.group_polls;
begin
  select * into v_poll from public.group_polls where id = p_poll;
  if not found then
    raise exception 'poll_not_found' using errcode = 'P0002';
  end if;
  perform public.assert_group_perm(v_poll.group_id, null);
  if v_poll.ends_at is not null and v_poll.ends_at <= now() then
    raise exception 'poll_closed' using errcode = '42501';
  end if;
  if p_option is null or p_option < 0 or p_option >= cardinality(v_poll.options) then
    raise exception 'invalid_payload' using errcode = '22023';
  end if;
  insert into public.group_poll_votes (poll_id, user_id, option_index) values (p_poll, auth.uid(), p_option)
  on conflict (poll_id, user_id) do update set option_index = excluded.option_index, voted_at = now();
end;
$$;

create or replace function public.respond_group_invite(p_invite uuid, p_accept boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_inv     public.group_invites;
  v_default uuid;
begin
  select * into v_inv from public.group_invites
  where id = p_invite and invitee_id = auth.uid() and status = 'pending'
  for update;
  if not found then
    raise exception 'invite_not_found' using errcode = 'P0002';
  end if;

  update public.group_invites
  set status = case when p_accept then 'accepted' else 'declined' end, responded_at = now()
  where id = p_invite;

  if p_accept then
    select id into v_default from public.group_roles where group_id = v_inv.group_id and is_default;
    insert into public.group_members (group_id, user_id, role_id, invited_by)
    values (v_inv.group_id, auth.uid(), v_default, v_inv.invited_by)
    on conflict do nothing;
    insert into public.group_messages (group_id, author_id, kind, ref_id)
    values (v_inv.group_id, auth.uid(), 'system', v_inv.id);
    perform public.log_group_activity(v_inv.group_id, 'member.joined',
      jsonb_build_object('user_id', auth.uid(), 'invited_by', v_inv.invited_by));
  end if;
end;
$$;

-- Invitations reçues en attente, avec de quoi afficher la carte.
create or replace function public.my_group_invites()
returns table (
  id           uuid,
  group_id     uuid,
  group_name   text,
  group_kind   public.group_kind,
  verified_at  timestamptz,
  member_count int,
  invited_by   uuid,
  intro        text,
  created_at   timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select i.id, g.id, g.name, g.kind, g.verified_at,
         (select count(*)::int from public.group_members m where m.group_id = g.id),
         i.invited_by, i.intro, i.created_at
  from public.group_invites i
  join public.groups g on g.id = i.group_id
  where i.invitee_id = auth.uid() and i.status = 'pending'
  order by i.created_at desc;
$$;

-- -----------------------------------------------------------------------------
-- my_groups : ajoute le nombre de suggestions que l'utilisateur peut valider.
-- -----------------------------------------------------------------------------
drop function public.my_groups();
create function public.my_groups()
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
  joined_at    timestamptz,
  to_validate  int
)
language sql
stable
security definer
set search_path = ''
as $$
  with mine as (
    select m.group_id, m.joined_at, r.id as role_id, r.name as role_name, r.rank as role_rank, r.color as role_color,
           case when r.is_founder then public.group_permission_catalog() else r.permissions end as perms
    from public.group_members m
    join public.group_roles r on r.id = m.role_id
    where m.user_id = auth.uid()
  )
  select g.id, g.kind, g.name, g.photo_url, g.plan, g.verified_at,
         (select count(*)::int from public.group_members x where x.group_id = g.id),
         mine.role_id, mine.role_name, mine.role_rank, mine.role_color, mine.perms, mine.joined_at,
         (select count(*)::int from public.group_suggestions s
          where s.group_id = g.id and s.status = 'pending' and s.expires_at > now()
            and public.suggestion_accept_perm(s.type) = any (mine.perms))
  from mine
  join public.groups g on g.id = mine.group_id
  order by mine.joined_at desc;
$$;

-- -----------------------------------------------------------------------------
-- Notifications
-- -----------------------------------------------------------------------------
create or replace function public.set_notification_prefs(p_group uuid, p_suggestions_push boolean, p_outcome_push boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if p_group is not null then
    perform public.assert_group_perm(p_group, null);
  end if;
  insert into public.notification_prefs (user_id, group_id, suggestions_push, outcome_push)
  values (auth.uid(), p_group, coalesce(p_suggestions_push, true), coalesce(p_outcome_push, true))
  on conflict (user_id, coalesce(group_id, '00000000-0000-0000-0000-000000000000'::uuid))
  do update set suggestions_push = excluded.suggestions_push,
                outcome_push = excluded.outcome_push,
                updated_at = now();
end;
$$;

create or replace function public.register_push_token(p_token text, p_platform text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  insert into public.user_push_tokens (token, user_id, platform) values (p_token, auth.uid(), p_platform)
  on conflict (token) do update set user_id = excluded.user_id, platform = excluded.platform, updated_at = now();
end;
$$;

-- Destinataires d'une notification de suggestion (Edge Function `notify`,
-- clé service_role) : habilités à valider, auteur exclu, préférences respectées
-- (réglage du groupe prioritaire sur le réglage global).
create or replace function public.suggestion_reviewers(p_suggestion uuid)
returns table (user_id uuid, token text, platform text)
language sql
stable
security definer
set search_path = ''
as $$
  select m.user_id, t.token, t.platform
  from public.group_suggestions s
  join public.group_members m on m.group_id = s.group_id and m.user_id <> s.author_id
  join public.user_push_tokens t on t.user_id = m.user_id
  where s.id = p_suggestion
    and public.suggestion_accept_perm(s.type) = any (public.group_member_permissions(s.group_id, m.user_id))
    and coalesce(
      (select p.suggestions_push from public.notification_prefs p where p.user_id = m.user_id and p.group_id = s.group_id),
      (select p.suggestions_push from public.notification_prefs p where p.user_id = m.user_id and p.group_id is null),
      true);
$$;

create or replace function public.suggestion_author_tokens(p_suggestion uuid)
returns table (user_id uuid, token text, platform text)
language sql
stable
security definer
set search_path = ''
as $$
  select s.author_id, t.token, t.platform
  from public.group_suggestions s
  join public.user_push_tokens t on t.user_id = s.author_id
  where s.id = p_suggestion
    and coalesce(
      (select p.outcome_push from public.notification_prefs p where p.user_id = s.author_id and p.group_id = s.group_id),
      (select p.outcome_push from public.notification_prefs p where p.user_id = s.author_id and p.group_id is null),
      true);
$$;

-- Tâche planifiée (pg_cron, service_role) : expire les suggestions échues.
create or replace function public.expire_group_suggestions()
returns int
language sql
security definer
set search_path = ''
as $$
  with done as (
    update public.group_suggestions set status = 'expired'
    where status = 'pending' and expires_at <= now()
    returning 1
  )
  select count(*)::int from done;
$$;

-- -----------------------------------------------------------------------------
-- Temps réel : le chat, les suggestions et les votes se mettent à jour ensemble.
-- -----------------------------------------------------------------------------
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table
      public.group_messages, public.group_suggestions, public.group_suggestion_votes,
      public.group_poll_votes, public.group_ride_participants;
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- Droits d'exécution
-- -----------------------------------------------------------------------------
revoke execute on function
  public.suggestion_direct_perm(public.suggestion_type),
  public.suggestion_accept_perm(public.suggestion_type),
  public.normalize_group_payload(uuid, public.suggestion_type, jsonb),
  public.apply_group_payload(uuid, public.suggestion_type, jsonb, uuid, uuid),
  public.group_action(uuid, public.suggestion_type, jsonb),
  public.decide_suggestion(uuid, boolean, jsonb, text),
  public.withdraw_suggestion(uuid),
  public.toggle_suggestion_vote(uuid),
  public.post_message(uuid, text),
  public.set_ride_participation(uuid, boolean),
  public.vote_poll(uuid, int),
  public.respond_group_invite(uuid, boolean),
  public.my_group_invites(),
  public.my_groups(),
  public.set_notification_prefs(uuid, boolean, boolean),
  public.register_push_token(text, text),
  public.suggestion_reviewers(uuid),
  public.suggestion_author_tokens(uuid),
  public.expire_group_suggestions()
from public, anon, authenticated;

grant execute on function
  public.suggestion_accept_perm(public.suggestion_type),
  public.group_action(uuid, public.suggestion_type, jsonb),
  public.decide_suggestion(uuid, boolean, jsonb, text),
  public.withdraw_suggestion(uuid),
  public.toggle_suggestion_vote(uuid),
  public.post_message(uuid, text),
  public.set_ride_participation(uuid, boolean),
  public.vote_poll(uuid, int),
  public.respond_group_invite(uuid, boolean),
  public.my_group_invites(),
  public.my_groups(),
  public.set_notification_prefs(uuid, boolean, boolean),
  public.register_push_token(text, text)
to authenticated;

-- L'Edge Function et la tâche planifiée utilisent la clé service_role.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function
      public.suggestion_reviewers(uuid),
      public.suggestion_author_tokens(uuid),
      public.expire_group_suggestions()
    to service_role;
  end if;
end $$;
