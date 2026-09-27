-- Tests de la vérification SIRET au registre (Pappers). Exécuter via supabase/tests/run.sh (Postgres local).
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
       set_config('t.e','55555555-5555-5555-5555-555555555555',true);

-- A fonde deux groupes pro et un groupe d'amis ; B est Membre ; C fonde un groupe d'amis ; E est modérateur.
select set_config('t.p', pg_temp.as_user(current_setting('t.a')::uuid, $q$select public.create_group('pro','Moto-école Bastille')::text$q$), true);
select set_config('t.q', pg_temp.as_user(current_setting('t.a')::uuid, $q$select public.create_group('pro','Garage du Canal')::text$q$), true);
select pg_temp.as_user(current_setting('t.c')::uuid, $q$select public.create_group('friends','Night Riders')::text$q$);
insert into group_members (group_id, user_id, role_id)
select current_setting('t.p')::uuid, current_setting('t.b')::uuid, r.id from group_roles r
where r.group_id = current_setting('t.p')::uuid and r.name = 'Membre';
insert into app_moderators values (current_setting('t.e')::uuid);

-- 1. Qui peut consulter le registre
select pg_temp.check(pg_temp.as_user(current_setting('t.a')::uuid, 'select public.can_lookup_siret()::text') = 'true', 'consultation : fondateur d''un groupe pro');
select pg_temp.check(pg_temp.as_user(current_setting('t.b')::uuid, 'select public.can_lookup_siret()::text') = 'false', 'consultation : simple membre refusé');
select pg_temp.check(pg_temp.as_user(current_setting('t.c')::uuid, 'select public.can_lookup_siret()::text') = 'false', 'consultation : fondateur d''un groupe d''amis refusé');
select pg_temp.check(pg_temp.as_user(current_setting('t.e')::uuid, 'select public.can_lookup_siret()::text') = 'true', 'consultation : modérateur');

-- 2. Le cache reste côté serveur
insert into siret_checks (siret, status, siren, legal_name, address, closed_on) values
  ('84215763000018', 'active', '842157630', 'MOTO-ECOLE BASTILLE', '12 rue de la Roquette 75011 Paris', null),
  ('51277804000018', 'closed', '512778040', 'GARAGE DU CANAL', '3 quai de Jemmapes 75010 Paris', '2025-06-30'),
  ('90133445000029', 'not_found', null, null, null, null);
select pg_temp.expect_error(current_setting('t.a')::uuid, 'select count(*) from public.siret_checks', 'permission denied for table siret_checks');
select pg_temp.expect_error(current_setting('t.a')::uuid, $q$insert into public.siret_checks (siret, status) values ('73282932000074', 'active')$q$, 'permission denied for table siret_checks');
select pg_temp.expect_error(current_setting('t.a')::uuid, $q$select public.siret_check_json('84215763000018')$q$, 'permission denied for function siret_check_json');
select pg_temp.expect_error(current_setting('t.a')::uuid, format('select public.note_siret_lookup(%L, ''84215763000018'')', current_setting('t.a')), 'permission denied for function note_siret_lookup');
select pg_temp.expect_error(current_setting('t.a')::uuid, 'select count(*) from public.sirets_to_recheck(10)', 'permission denied for function sirets_to_recheck');

-- 3. Demande de badge : le registre bloque les établissements fermés ou inconnus
select pg_temp.expect_error(current_setting('t.a')::uuid, format('select public.request_group_verification(%L, ''Garage du Canal SARL'', ''51277804000018'')', current_setting('t.q')), 'siret_closed');
select pg_temp.expect_error(current_setting('t.a')::uuid, format('select public.request_group_verification(%L, ''Garage du Canal SARL'', ''901 334 450 00029'')', current_setting('t.q')), 'siret_not_found');
select pg_temp.expect_error(current_setting('t.a')::uuid, format('select public.request_group_verification(%L, ''Garage du Canal SARL'', ''51277804000019'')', current_setting('t.q')), 'invalid_siret');
-- Un « introuvable » ancien de plus de 30 jours ne bloque plus.
update siret_checks set checked_at = now() - interval '31 days' where siret = '90133445000029';
select pg_temp.check(pg_temp.as_user(current_setting('t.a')::uuid, format('select public.request_group_verification(%L, ''Garage du Canal SARL'', ''90133445000029'')::text', current_setting('t.q'))) is not null, 'demande : consultation périmée, passe (vérif manuelle)');
-- SIRET jamais consulté (registre indisponible) : la demande passe.
select pg_temp.check(pg_temp.as_user(current_setting('t.a')::uuid, format('select public.request_group_verification(%L, ''Moto-école Bastille SAS'', ''84215763000018'')::text', current_setting('t.p'))) is not null, 'demande : établissement actif accepté');

-- 4. File de modération : résultat du registre joint
select pg_temp.check(pg_temp.as_user(current_setting('t.e')::uuid, $q$select registry->>'status' from public.pending_verifications() where siret = '84215763000018'$q$) = 'active', 'modération : statut du registre');
select pg_temp.check(pg_temp.as_user(current_setting('t.e')::uuid, $q$select registry->>'legal_name' from public.pending_verifications() where siret = '84215763000018'$q$) = 'MOTO-ECOLE BASTILLE', 'modération : dénomination du registre');
select pg_temp.check(pg_temp.as_user(current_setting('t.e')::uuid, $q$select registry->>'status' from public.pending_verifications() where siret = '90133445000029'$q$) = 'not_found', 'modération : ancien résultat visible');
select pg_temp.expect_error(current_setting('t.a')::uuid, 'select count(*) from public.pending_verifications()', 'forbidden');

-- 5. Revérification mensuelle des badges accordés
select pg_temp.as_user(current_setting('t.e')::uuid, format($q$select public.decide_group_verification(r.id, true)::text from public.pending_verifications() r where r.group_id = %L$q$, current_setting('t.p')));
select pg_temp.as_user(current_setting('t.e')::uuid, format($q$select public.decide_group_verification(r.id, true)::text from public.pending_verifications() r where r.group_id = %L$q$, current_setting('t.q')));
select pg_temp.check((select count(*) from public.sirets_to_recheck(10)) = 1, 'recheck : seul le SIRET périmé est à revérifier');
select pg_temp.check((select siret from public.sirets_to_recheck(10)) = '90133445000029', 'recheck : le bon SIRET');
-- Le registre répond : le garage est fermé.
update siret_checks set status = 'closed', closed_on = '2026-08-31', checked_at = now() where siret = '90133445000029';
select pg_temp.check((select count(*) from public.sirets_to_recheck(10)) = 0, 'recheck : plus rien à revérifier');
select pg_temp.check(pg_temp.as_user(current_setting('t.e')::uuid, 'select count(*)::text from public.flagged_verified_groups()') = '1', 'badges à revoir : un établissement fermé');
select pg_temp.check(pg_temp.as_user(current_setting('t.e')::uuid, 'select group_name from public.flagged_verified_groups()') = 'Garage du Canal', 'badges à revoir : le bon groupe');
select pg_temp.expect_error(current_setting('t.a')::uuid, 'select count(*) from public.flagged_verified_groups()', 'forbidden');
select pg_temp.as_user(current_setting('t.e')::uuid, format($q$select public.revoke_group_verification(%L, 'Établissement fermé au registre')::text$q$, current_setting('t.q')));
select pg_temp.check(pg_temp.as_user(current_setting('t.e')::uuid, 'select count(*)::text from public.flagged_verified_groups()') = '0', 'badges à revoir : vide après retrait');

-- 6. Plafond de consultations : 20 par heure, sauf modérateurs
select pg_temp.check((select bool_and(public.note_siret_lookup(current_setting('t.a')::uuid, '84215763000018')) from generate_series(1, 20)), 'plafond : 20 consultations acceptées');
select pg_temp.check(not public.note_siret_lookup(current_setting('t.a')::uuid, '84215763000018'), 'plafond : la 21e refusée');
select pg_temp.check((select bool_and(public.note_siret_lookup(current_setting('t.e')::uuid, '84215763000018')) from generate_series(1, 25)), 'plafond : modérateur non plafonné');
rollback;
