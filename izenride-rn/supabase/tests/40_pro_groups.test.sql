-- Tests du lot 4. Exécuter via supabase/tests/run.sh (Postgres local).
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

-- A fonde une moto-école (pro) ; B y est Gestionnaire ; D Membre ; E est modérateur IzenRide.
select set_config('t.p', pg_temp.as_user(current_setting('t.a')::uuid, $q$select public.create_group('pro','Moto-école Bastille')::text$q$), true);
select set_config('t.f', pg_temp.as_user(current_setting('t.a')::uuid, $q$select public.create_group('friends','Night Riders')::text$q$), true);
insert into group_members (group_id, user_id, role_id)
select current_setting('t.p')::uuid, u.id, r.id from (values
  (current_setting('t.b')::uuid,'Gestionnaire'),(current_setting('t.d')::uuid,'Membre')) u(id,rn)
join group_roles r on r.group_id = current_setting('t.p')::uuid and r.name = u.rn;
insert into app_moderators values (current_setting('t.e')::uuid);

-- 1. SIRET
select pg_temp.check(public.is_valid_siret('73282932000074'), 'SIRET valide (clé de Luhn)');
select pg_temp.check(not public.is_valid_siret('73282932000075'), 'SIRET à clé fausse rejeté');
select pg_temp.check(public.is_valid_siret('35600000000048'), 'La Poste : siège (Luhn)');
select pg_temp.check(public.is_valid_siret('35600000049837'), 'La Poste : établissement (somme multiple de 5)');
select pg_temp.check(not public.is_valid_siret('12345678900048'), 'SIRET quelconque invalide');

-- 2. Demande de badge
select pg_temp.expect_error(current_setting('t.b')::uuid, format('select public.request_group_verification(%L, ''Moto-école Bastille SAS'', ''73282932000074'')', current_setting('t.p')), 'founder_only');
select pg_temp.expect_error(current_setting('t.a')::uuid, format('select public.request_group_verification(%L, ''Night Riders'', ''73282932000074'')', current_setting('t.f')), 'pro_only');
select pg_temp.expect_error(current_setting('t.a')::uuid, format('select public.request_group_verification(%L, ''Moto-école Bastille SAS'', ''73282932000075'')', current_setting('t.p')), 'invalid_siret');
select pg_temp.expect_error(current_setting('t.a')::uuid, format('select public.request_group_verification(%L, ''Moto-école Bastille SAS'', ''73282932000074'', null, ''autre-groupe/kbis.pdf'')', current_setting('t.p')), 'invalid_payload');
select set_config('t.r', pg_temp.as_user(current_setting('t.a')::uuid, format(
  'select public.request_group_verification(%L, ''Moto-école Bastille SAS'', ''732 829 320 00074'', ''https://motoecole-bastille.fr'', %L)::text',
  current_setting('t.p'), current_setting('t.p') || '/kbis.pdf')), true);
select pg_temp.expect_error(current_setting('t.a')::uuid, format('select public.request_group_verification(%L, ''Moto-école Bastille SAS'', ''73282932000074'')', current_setting('t.p')), 'verification_pending');
select pg_temp.check(pg_temp.as_user(current_setting('t.b')::uuid, 'select count(*)::text from public.group_verification_requests') = '1', 'le Gestionnaire (group.edit) voit la demande');
select pg_temp.check(pg_temp.as_user(current_setting('t.d')::uuid, 'select count(*)::text from public.group_verification_requests') = '0', 'un simple membre ne la voit pas');

-- 3. Modération
select pg_temp.expect_error(current_setting('t.a')::uuid, 'select * from public.pending_verifications()', 'forbidden');
select pg_temp.check(pg_temp.as_user(current_setting('t.e')::uuid, 'select count(*)::text from public.pending_verifications()') = '1', 'le modérateur voit la file');
select pg_temp.expect_error(current_setting('t.e')::uuid, format('select public.decide_group_verification(%L, false)', current_setting('t.r')), 'reason_required');
select pg_temp.as_user(current_setting('t.e')::uuid, format('select public.decide_group_verification(%L, true)::text', current_setting('t.r')));
select pg_temp.check((select verified_at is not null from groups where id = current_setting('t.p')::uuid), 'badge vérifié accordé');
select pg_temp.expect_error(current_setting('t.a')::uuid, format('select public.request_group_verification(%L, ''X SAS'', ''73282932000074'')', current_setting('t.p')), 'already_verified');
select pg_temp.as_user(current_setting('t.e')::uuid, format('select public.revoke_group_verification(%L, ''SIRET radié'')::text', current_setting('t.p')));
select pg_temp.check((select verified_at is null from groups where id = current_setting('t.p')::uuid), 'badge retiré');
select pg_temp.check((select status from group_verification_requests where id = current_setting('t.r')::uuid) = 'revoked', 'demande marquée retirée');

-- 4. Sorties promues dans Événements
select pg_temp.as_user(current_setting('t.b')::uuid, format(
  'select public.group_action(%L, ''ride'', jsonb_build_object(''title'',''Stage piste'',''starts_at'',now()+interval ''5 days'',''meeting_point'',''Circuit Carole''))::text',
  current_setting('t.p')));
select pg_temp.as_user(current_setting('t.b')::uuid, format(
  'select public.group_action(%L, ''ride'', jsonb_build_object(''title'',''Sortie élèves'',''starts_at'',now()+interval ''5 days'',''meeting_point'',''Bastille'',''members_only'',true))::text',
  current_setting('t.p')));
select pg_temp.as_user(current_setting('t.a')::uuid, format(
  'select public.group_action(%L, ''ride'', jsonb_build_object(''title'',''Entre amis'',''starts_at'',now()+interval ''5 days'',''meeting_point'',''Bastille''))::text',
  current_setting('t.f')));
select pg_temp.check(pg_temp.as_user(current_setting('t.c')::uuid, 'select string_agg(title, '','') from public.public_pro_rides()') = 'Stage piste',
  'Événements : seule la sortie pro publique est visible d’un non-membre');
select set_config('t.ride', (select id::text from group_rides where title = 'Stage piste'), true);
select pg_temp.as_user(current_setting('t.c')::uuid, format('select public.join_public_ride(%L, true)::text', current_setting('t.ride')));
select pg_temp.check(pg_temp.as_user(current_setting('t.c')::uuid, 'select (going and not is_member and participants = 2)::text from public.public_pro_rides()') = 'true',
  'un rider hors groupe s’inscrit sans entrer dans le groupe');
select pg_temp.expect_error(current_setting('t.c')::uuid, format('select public.join_public_ride((select id from public.group_rides where title = %L), true)', 'Sortie élèves'), 'ride_not_found');
select pg_temp.expect_error(current_setting('t.c')::uuid, format('select public.join_public_ride((select id from public.group_rides where title = %L), true)', 'Entre amis'), 'ride_not_found');
select pg_temp.check(pg_temp.as_user(current_setting('t.c')::uuid, 'select count(*)::text from public.groups') = '0', 'le groupe reste privé');

-- 5. Statistiques
select pg_temp.as_user(current_setting('t.b')::uuid, format('select public.post_message(%L, ''Bienvenue aux nouveaux élèves'')::text', current_setting('t.p')));
select set_config('t.stats', pg_temp.as_user(current_setting('t.a')::uuid, format('select public.group_stats(%L)::text', current_setting('t.p'))), true);
select pg_temp.check((current_setting('t.stats')::jsonb #>> '{members,total}')::int = 3, 'stats : 3 membres');
select pg_temp.check((current_setting('t.stats')::jsonb #>> '{engagement,active_7d}')::int = 1, 'stats : 1 membre actif sur 7 jours (seul le Gestionnaire a posté)');
select pg_temp.check((current_setting('t.stats')::jsonb #>> '{rides,outside_participants}')::int = 1, 'stats : 1 inscrit hors groupe');
select pg_temp.check(jsonb_array_length(current_setting('t.stats')::jsonb #> '{engagement,messages_per_week}') = 8, 'stats : 8 semaines de messages');
select pg_temp.expect_error(current_setting('t.d')::uuid, format('select public.group_stats(%L)', current_setting('t.p')), 'forbidden');

-- 6. Rétention du journal, flag premium, sécurité
insert into group_activity_log (group_id, action, created_at) values (current_setting('t.p')::uuid, 'vieux', now() - interval '13 months');
select pg_temp.check(public.purge_group_activity() = 1, 'journal : purge au-delà de 12 mois');
select pg_temp.check(pg_temp.as_user(current_setting('t.a')::uuid, format('select public.has_feature(%L, ''stats.advanced'')::text', current_setting('t.p'))) = 'true', 'flag premium : tout est ouvert');
select pg_temp.check(pg_temp.as_user(current_setting('t.c')::uuid, format('select public.is_founder_of_folder(%L)::text', current_setting('t.p'))) = 'false', 'dossier Storage : pas fondateur');
select pg_temp.check(pg_temp.as_user(current_setting('t.a')::uuid, format('select public.is_founder_of_folder(%L)::text', current_setting('t.p'))) = 'true', 'dossier Storage : fondateur');
select pg_temp.check(pg_temp.as_user(current_setting('t.a')::uuid, $q$select public.is_founder_of_folder('../etc')::text$q$) = 'false', 'dossier Storage : nom invalide toléré');
select pg_temp.expect_error(current_setting('t.a')::uuid, format('select public.group_member_rank(%L, %L)', current_setting('t.p'), current_setting('t.b')), 'permission denied for function group_member_rank');
rollback;
