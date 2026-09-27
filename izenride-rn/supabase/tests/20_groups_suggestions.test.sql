-- Tests du lot 2. Exécuter via supabase/tests/run.sh (Postgres local).
\set ON_ERROR_STOP on
-- Utilitaire : exécute une requête en tant qu'utilisateur et attend une erreur précise.
create function pg_temp.expect_error(p_user uuid, p_sql text, p_msg text) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', coalesce(p_user::text, ''), true);
  execute 'set local role authenticated';
  begin
    execute p_sql;
  exception when others then
    execute 'reset role';
    if sqlerrm <> p_msg and sqlerrm not like p_msg then
      raise exception 'ÉCHEC % : attendu "%" obtenu "%"', p_sql, p_msg, sqlerrm;
    end if;
    raise notice 'ok (erreur attendue) : % -> %', left(p_sql, 60), sqlerrm;
    return;
  end;
  execute 'reset role';
  raise exception 'ÉCHEC % : aucune erreur, attendu "%"', p_sql, p_msg;
end $$;

create function pg_temp.as_user(p_user uuid, p_sql text) returns text language plpgsql as $$
declare v text;
begin
  perform set_config('request.jwt.claim.sub', coalesce(p_user::text, ''), true);
  execute 'set local role authenticated';
  execute p_sql into v;
  execute 'reset role';
  return v;
end $$;

create function pg_temp.check(p_ok boolean, p_label text) returns void language plpgsql as $$
begin
  if not p_ok then raise exception 'ÉCHEC : %', p_label; end if;
  raise notice 'ok : %', p_label;
end $$;


begin;
select set_config('t.a','11111111-1111-1111-1111-111111111111',true),
       set_config('t.b','22222222-2222-2222-2222-222222222222',true),
       set_config('t.c','33333333-3333-3333-3333-333333333333',true),
       set_config('t.d','44444444-4444-4444-4444-444444444444',true),
       set_config('t.e','55555555-5555-5555-5555-555555555555',true);

-- Groupe d'amis : A fondateur, B Membre, C Road captain, D Admin. E extérieur.
select set_config('t.g', pg_temp.as_user(current_setting('t.a')::uuid,
  $q$select public.create_group('friends','Night Riders Paris')::text$q$), true);
insert into group_members (group_id, user_id, role_id)
select current_setting('t.g')::uuid, u.id, r.id from (values
  (current_setting('t.b')::uuid,'Membre'),(current_setting('t.c')::uuid,'Road captain'),(current_setting('t.d')::uuid,'Admin')) u(id,rn)
join group_roles r on r.group_id = current_setting('t.g')::uuid and r.name = u.rn;

create function pg_temp.ride(p_title text, p_members_only boolean default null) returns text language sql as $$
  select jsonb_build_object('title', p_title, 'starts_at', now() + interval '3 days',
                            'meeting_point', 'Bastille', 'members_only', p_members_only)::text $$;

-- 1. Membre simple : sa sortie devient une suggestion
select set_config('t.s1', pg_temp.as_user(current_setting('t.b')::uuid, format(
  'select (public.group_action(%L, ''ride'', %L::jsonb) ->> ''id'')', current_setting('t.g'), pg_temp.ride('Night ride'))), true);
select pg_temp.check((select status::text from group_suggestions where id = current_setting('t.s1')::uuid) = 'pending', 'B : sortie proposée en suggestion');
select pg_temp.check(exists(select 1 from group_messages where ref_id = current_setting('t.s1')::uuid and kind = 'suggestion'), 'carte de suggestion dans le chat');
select pg_temp.check((select expires_at from group_suggestions where id = current_setting('t.s1')::uuid) <= now() + interval '3 days', 'expiration à la date de la sortie');

-- 2. Road captain : création directe
select pg_temp.check(pg_temp.as_user(current_setting('t.c')::uuid, format(
  'select public.group_action(%L, ''ride'', %L::jsonb) ->> ''mode''', current_setting('t.g'), pg_temp.ride('Chevreuse'))) = 'created', 'C : sortie créée directement');
select pg_temp.check((select count(*) from group_ride_participants p join group_rides r on r.id = p.ride_id where r.title = 'Chevreuse') = 1, 'le créateur est inscrit');

-- 3. Validation des contenus
select pg_temp.expect_error(current_setting('t.b')::uuid, format('select public.group_action(%L, ''ride'', ''{"title":"x","starts_at":"2020-01-01","meeting_point":"Bastille"}'')', current_setting('t.g')), 'invalid_payload');
select pg_temp.expect_error(current_setting('t.b')::uuid, format('select public.group_action(%L, ''ride'', ''{"title":"Sortie","starts_at":"demain","meeting_point":"Bastille"}'')', current_setting('t.g')), 'invalid_payload');
select pg_temp.expect_error(current_setting('t.b')::uuid, format('select public.group_action(%L, ''poll'', ''{"question":"Où ?","options":["A","a"]}'')', current_setting('t.g')), 'invalid_payload');
select pg_temp.expect_error(current_setting('t.e')::uuid, format('select public.group_action(%L, ''ride'', %L::jsonb)', current_setting('t.g'), pg_temp.ride('Intrus')), 'not_member');

-- 4. Limite de 5 suggestions en attente
select set_config('t.p1', pg_temp.as_user(current_setting('t.b')::uuid, format(
  'select public.group_action(%L, ''poll'', ''{"question":"Vendredi ou samedi ?","options":["Vendredi","Samedi"]}'') ->> ''id''', current_setting('t.g'))), true);
select set_config('t.a1', pg_temp.as_user(current_setting('t.b')::uuid, format(
  'select public.group_action(%L, ''announcement'', ''{"body":"Pensez aux gilets","pin_days":3}'') ->> ''id''', current_setting('t.g'))), true);
select set_config('t.r2', pg_temp.as_user(current_setting('t.b')::uuid, format(
  'select public.group_action(%L, ''ride'', %L::jsonb) ->> ''id''', current_setting('t.g'), pg_temp.ride('Vexin'))), true);
select pg_temp.as_user(current_setting('t.b')::uuid, format('select public.group_action(%L, ''ride'', %L::jsonb)::text', current_setting('t.g'), pg_temp.ride('Rambouillet')));
select pg_temp.expect_error(current_setting('t.b')::uuid, format('select public.group_action(%L, ''ride'', %L::jsonb)', current_setting('t.g'), pg_temp.ride('Une de trop')), 'too_many_pending');

-- 5. Pas de décision sans la permission
select pg_temp.expect_error(current_setting('t.b')::uuid, format('select public.decide_suggestion(%L, true)', current_setting('t.s1')), 'forbidden');

-- 6. Acceptation en 1 clic ; le second clic est refusé
select pg_temp.check(pg_temp.as_user(current_setting('t.c')::uuid, format('select public.decide_suggestion(%L, true) ->> ''status''', current_setting('t.s1'))) = 'accepted', 'C accepte la sortie en 1 clic');
select pg_temp.check((select from_suggestion_id from group_rides where title = 'Night ride') = current_setting('t.s1')::uuid, 'la sortie est créée depuis la suggestion');
select pg_temp.check((select created_by from group_rides where title = 'Night ride') = current_setting('t.b')::uuid, 'l’auteur de la suggestion est le créateur');
select pg_temp.expect_error(current_setting('t.d')::uuid, format('select public.decide_suggestion(%L, true)', current_setting('t.s1')), 'already_decided');

-- 7. Modifier avant d'accepter
select pg_temp.check(pg_temp.as_user(current_setting('t.c')::uuid, format(
  'select public.decide_suggestion(%L, true, ''{"question":"Vendredi, samedi ou dimanche ?","options":["Vendredi","Samedi","Dimanche"]}'') ->> ''status''', current_setting('t.p1'))) = 'accepted_edited', 'sondage accepté après modification');
select pg_temp.check((select cardinality(options) from group_polls where from_suggestion_id = current_setting('t.p1')::uuid) = 3, 'la version modifiée est appliquée');

-- 8. Refus : motif obligatoire
select pg_temp.expect_error(current_setting('t.d')::uuid, format('select public.decide_suggestion(%L, false)', current_setting('t.a1')), 'reason_required');
select pg_temp.check(pg_temp.as_user(current_setting('t.d')::uuid, format('select public.decide_suggestion(%L, false, null, ''Déjà annoncé'') ->> ''status''', current_setting('t.a1'))) = 'refused', 'annonce refusée avec motif');

-- 9. Retrait par l'auteur uniquement
select pg_temp.expect_error(current_setting('t.c')::uuid, format('select public.withdraw_suggestion(%L)', current_setting('t.r2')), 'suggestion_not_found');
select pg_temp.as_user(current_setting('t.b')::uuid, format('select public.withdraw_suggestion(%L)::text', current_setting('t.r2')));
select pg_temp.check((select status::text from group_suggestions where id = current_setting('t.r2')::uuid) = 'withdrawn', 'B retire sa suggestion');

-- 10. 👍 indicatifs
select set_config('t.r3', (select id::text from group_suggestions where payload ->> 'title' = 'Rambouillet'), true);
select pg_temp.check(pg_temp.as_user(current_setting('t.a')::uuid, format('select public.toggle_suggestion_vote(%L)::text', current_setting('t.r3'))) = '1', '👍 ajouté');
select pg_temp.check(pg_temp.as_user(current_setting('t.a')::uuid, format('select public.toggle_suggestion_vote(%L)::text', current_setting('t.r3'))) = '0', '👍 retiré');

-- 11. Compteur « à valider »
select pg_temp.check(pg_temp.as_user(current_setting('t.d')::uuid, 'select to_validate::text from public.my_groups()') = '1', 'D a 1 suggestion à valider');
select pg_temp.check(pg_temp.as_user(current_setting('t.b')::uuid, 'select to_validate::text from public.my_groups()') = '0', 'B n’a rien à valider');

-- 12. Suggestion de membre -> invitation -> adhésion
select set_config('t.m1', pg_temp.as_user(current_setting('t.b')::uuid, format(
  'select public.group_action(%L, ''member'', %L::jsonb) ->> ''id''', current_setting('t.g'),
  jsonb_build_object('user_id', current_setting('t.e'), 'intro', 'Mon pote Léo')::text)), true);
select pg_temp.expect_error(current_setting('t.b')::uuid, format('select public.group_action(%L, ''member'', %L::jsonb)', current_setting('t.g'),
  jsonb_build_object('user_id', current_setting('t.a'))::text), 'already_member');
select pg_temp.as_user(current_setting('t.d')::uuid, format('select public.decide_suggestion(%L, true)::text', current_setting('t.m1')));
select pg_temp.check(pg_temp.as_user(current_setting('t.e')::uuid, 'select count(*)::text from public.my_group_invites()') = '1', 'E voit son invitation');
select pg_temp.check(pg_temp.as_user(current_setting('t.e')::uuid, 'select count(*)::text from public.groups') = '0', 'E ne voit pas encore le groupe');
select pg_temp.expect_error(current_setting('t.e')::uuid, format('select public.group_action(%L, ''member'', %L::jsonb)', current_setting('t.g'),
  jsonb_build_object('user_id', current_setting('t.e'))::text), 'not_member');
select pg_temp.as_user(current_setting('t.e')::uuid, format('select public.respond_group_invite((select id from public.my_group_invites()), true)::text'));
select pg_temp.check(public.group_member_rank(current_setting('t.g')::uuid, current_setting('t.e')::uuid) = 10, 'E rejoint avec le rôle par défaut');
select pg_temp.check((select invited_by from group_members where user_id = current_setting('t.e')::uuid) = current_setting('t.b')::uuid, 'invité par l’auteur de la suggestion');

-- 13. Sourdine : impossible d'écrire
select pg_temp.as_user(current_setting('t.d')::uuid, format('select public.mute_member(%L, %L, now() + interval ''1 day'')::text', current_setting('t.g'), current_setting('t.b')));
select pg_temp.expect_error(current_setting('t.b')::uuid, format('select public.post_message(%L, ''Salut'')', current_setting('t.g')), 'muted');
select pg_temp.check(pg_temp.as_user(current_setting('t.c')::uuid, format('select public.post_message(%L, ''Salut'') is not null', current_setting('t.g')))::boolean, 'C écrit dans le chat');

-- 14. Sondage
select set_config('t.poll', (select id::text from group_polls where from_suggestion_id = current_setting('t.p1')::uuid), true);
select pg_temp.as_user(current_setting('t.b')::uuid, format('select public.vote_poll(%L, 1)::text', current_setting('t.poll')));
select pg_temp.as_user(current_setting('t.b')::uuid, format('select public.vote_poll(%L, 2)::text', current_setting('t.poll')));
select pg_temp.check((select option_index from group_poll_votes where poll_id = current_setting('t.poll')::uuid) = 2, 'vote modifiable, un seul par membre');
select pg_temp.expect_error(current_setting('t.b')::uuid, format('select public.vote_poll(%L, 9)', current_setting('t.poll')), 'invalid_payload');

-- 15. Expiration
update group_suggestions set expires_at = now() - interval '1 minute' where id = current_setting('t.r3')::uuid;
select pg_temp.check(pg_temp.as_user(current_setting('t.c')::uuid, format('select public.decide_suggestion(%L, true) ->> ''status''', current_setting('t.r3'))) = 'expired', 'suggestion échue : expirée, rien n’est créé');
select pg_temp.check(not exists(select 1 from group_rides where title = 'Rambouillet'), 'pas de sortie créée pour une suggestion expirée');

-- 16. Groupe pro : sorties publiques par défaut ; groupe d'amis : toujours internes
select set_config('t.pro', pg_temp.as_user(current_setting('t.a')::uuid, $q$select public.create_group('pro','Moto-école Bastille')::text$q$), true);
select pg_temp.as_user(current_setting('t.a')::uuid, format('select public.group_action(%L, ''ride'', %L::jsonb)::text', current_setting('t.pro'), pg_temp.ride('Stage piste')));
select pg_temp.check(not (select members_only from group_rides where title = 'Stage piste'), 'pro : sortie promue par défaut');
select pg_temp.as_user(current_setting('t.a')::uuid, format('select public.group_action(%L, ''ride'', %L::jsonb)::text', current_setting('t.g'), pg_temp.ride('Entre nous', false)));
select pg_temp.check((select members_only from group_rides where title = 'Entre nous'), 'amis : sortie toujours interne');

-- 17. Préférences et fonctions réservées au serveur
select pg_temp.as_user(current_setting('t.d')::uuid, format('select public.set_notification_prefs(%L, false, true)::text', current_setting('t.g')));
select pg_temp.as_user(current_setting('t.d')::uuid, 'select public.set_notification_prefs(null, true, true)::text');
select pg_temp.as_user(current_setting('t.d')::uuid, format('select public.set_notification_prefs(%L, true, false)::text', current_setting('t.g')));
select pg_temp.check((select count(*) from notification_prefs where user_id = current_setting('t.d')::uuid) = 2, 'une préférence globale + une par groupe (mise à jour)');
insert into user_push_tokens values ('tok-c', current_setting('t.c')::uuid, 'ios'), ('tok-d', current_setting('t.d')::uuid, 'ios'), ('tok-b', current_setting('t.b')::uuid, 'android');
select set_config('t.s9', pg_temp.as_user(current_setting('t.e')::uuid, format(
  'select public.group_action(%L, ''ride'', %L::jsonb) ->> ''id''', current_setting('t.g'), pg_temp.ride('Proposée par E'))), true);
select pg_temp.check((select array_agg(token order by token) from public.suggestion_reviewers(current_setting('t.s9')::uuid)) = array['tok-c','tok-d'], 'notifiés : habilités à valider, auteur exclu');
select pg_temp.expect_error(current_setting('t.d')::uuid, format('select * from public.suggestion_reviewers(%L)', current_setting('t.s9')), 'permission denied for function suggestion_reviewers');
select pg_temp.expect_error(current_setting('t.b')::uuid, format('select public.apply_group_payload(%L, ''ride'', ''{}'', %L, null)', current_setting('t.g'), current_setting('t.b')), 'permission denied for function apply_group_payload');
rollback;
