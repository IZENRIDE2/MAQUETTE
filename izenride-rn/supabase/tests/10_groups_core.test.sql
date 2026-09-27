-- Tests du lot 1. Exécuter via supabase/tests/run.sh (Postgres local).
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

-- 1. Création par A
select set_config('t.g', pg_temp.as_user(current_setting('t.a')::uuid,
  $q$select public.create_group('friends','Night Riders Paris','Sorties de nuit')::text$q$), true);
select pg_temp.check((select count(*) from group_roles where group_id = current_setting('t.g')::uuid) = 4, '4 rôles par défaut');
select pg_temp.check(public.group_member_rank(current_setting('t.g')::uuid, current_setting('t.a')::uuid) = 100, 'A est fondateur');

-- 2. Ajout direct de B (Membre), C (Road captain), D (Admin)
insert into group_members (group_id, user_id, role_id)
select current_setting('t.g')::uuid, u.id, r.id from (values
  (current_setting('t.b')::uuid,'Membre'),(current_setting('t.c')::uuid,'Road captain'),(current_setting('t.d')::uuid,'Admin')) u(id,rn)
join group_roles r on r.group_id = current_setting('t.g')::uuid and r.name = u.rn;

-- 3. E (non membre) ne voit rien
select pg_temp.check(pg_temp.as_user(current_setting('t.e')::uuid, 'select count(*)::text from public.groups') = '0', 'RLS : non-membre ne voit pas le groupe');
select pg_temp.check(pg_temp.as_user(current_setting('t.e')::uuid, 'select count(*)::text from public.my_groups()') = '0', 'my_groups vide pour non-membre');
select pg_temp.expect_error(current_setting('t.e')::uuid, format('select public.update_group(%L, ''{"name":"x"}'')', current_setting('t.g')), 'not_member');

-- 4. B membre simple
select pg_temp.check(pg_temp.as_user(current_setting('t.b')::uuid, 'select count(*)::text from public.group_members') = '4', 'B voit les 4 membres');
select pg_temp.check(pg_temp.as_user(current_setting('t.b')::uuid, 'select cardinality(permissions)::text from public.my_groups()') = '0', 'B sans permission');
select pg_temp.check(pg_temp.as_user(current_setting('t.a')::uuid, 'select cardinality(permissions)::text from public.my_groups()') = '14', 'A a les 14 permissions');
select pg_temp.expect_error(current_setting('t.b')::uuid, format('select public.update_group(%L, ''{"name":"x"}'')', current_setting('t.g')), 'forbidden');
select pg_temp.expect_error(current_setting('t.b')::uuid, format('insert into public.groups(name, created_by) values (%L, %L)', 'Pirate', current_setting('t.b')), 'permission denied for table groups');
select pg_temp.expect_error(current_setting('t.b')::uuid, format('select public.log_group_activity(%L, ''fake'')', current_setting('t.g')), 'permission denied for function log_group_activity');
select pg_temp.expect_error(current_setting('t.b')::uuid, format('select public.group_member_rank(%L, %L)', current_setting('t.g'), current_setting('t.a')), 'permission denied for function group_member_rank');
do $$ begin
  set local role anon;
  begin
    perform * from public.my_groups();
    raise exception 'ÉCHEC : anon peut appeler my_groups';
  exception when insufficient_privilege then
    raise notice 'ok (erreur attendue) : anon -> %', sqlerrm;
  end;
  reset role;
end $$;

-- 5. D admin : pas de roles.manage
select pg_temp.expect_error(current_setting('t.d')::uuid, format('select public.upsert_role(%L, null, ''X'', ''#123456'', 20, ''{}'')', current_setting('t.g')), 'forbidden');
-- update_group autorisé pour l'admin
select pg_temp.as_user(current_setting('t.d')::uuid, format('select public.update_group(%L, ''{"meeting_point":"Bastille"}'')::text', current_setting('t.g')));
select pg_temp.check((select meeting_point from groups where id = current_setting('t.g')::uuid) = 'Bastille', 'update_group partiel');
select pg_temp.check((select name from groups where id = current_setting('t.g')::uuid) = 'Night Riders Paris', 'nom inchangé');

-- 6. A crée un rôle
select set_config('t.r', pg_temp.as_user(current_setting('t.a')::uuid,
  format('select public.upsert_role(%L, null, ''Mécano'', ''#4ade80'', 60, ''{poll.create}'')::text', current_setting('t.g'))), true);
select pg_temp.expect_error(current_setting('t.a')::uuid, format('select public.upsert_role(%L, null, ''Y'', ''#123456'', 20, ''{fly}'')', current_setting('t.g')), 'unknown_permission');
select pg_temp.expect_error(current_setting('t.a')::uuid, format('select public.upsert_role(%L, null, ''Y'', ''#123456'', 100, ''{}'')', current_setting('t.g')), 'rank_too_high');

-- 7. D change des rôles
select pg_temp.as_user(current_setting('t.d')::uuid, format('select public.assign_role(%L, %L, %L)::text', current_setting('t.g'), current_setting('t.b'), current_setting('t.r')));
select pg_temp.check(public.group_member_rank(current_setting('t.g')::uuid, current_setting('t.b')::uuid) = 60, 'B passe Mécano');
select pg_temp.expect_error(current_setting('t.d')::uuid, format('select public.assign_role(%L, %L, %L)', current_setting('t.g'), current_setting('t.a'), current_setting('t.r')), 'rank_too_high');
select pg_temp.expect_error(current_setting('t.d')::uuid, format('select public.assign_role(%L, %L, (select id from public.group_roles where name=''Admin''))', current_setting('t.g'), current_setting('t.c')), 'rank_too_high');

-- 8. Retrait
select pg_temp.as_user(current_setting('t.d')::uuid, format('select public.remove_member(%L, %L)::text', current_setting('t.g'), current_setting('t.c')));
select pg_temp.check(public.group_member_rank(current_setting('t.g')::uuid, current_setting('t.c')::uuid) is null, 'C retiré');
select pg_temp.expect_error(current_setting('t.d')::uuid, format('select public.remove_member(%L, %L)', current_setting('t.g'), current_setting('t.a')), 'rank_too_high');

-- 9. Réordonnancement : Membre passe au-dessus de Road captain
select pg_temp.as_user(current_setting('t.a')::uuid, format(
  'select public.reorder_roles(%L, array(select id from public.group_roles where name in (''Admin'',''Mécano'',''Membre'',''Road captain'') order by array_position(array[''Admin'',''Mécano'',''Membre'',''Road captain''], name)))::text',
  current_setting('t.g')));
select pg_temp.check((select rank from group_roles where group_id = current_setting('t.g')::uuid and name='Membre') = 50, 'Membre prend le rang 50');
select pg_temp.check((select rank from group_roles where group_id = current_setting('t.g')::uuid and name='Road captain') = 10, 'Road captain prend le rang 10');
select pg_temp.expect_error(current_setting('t.a')::uuid, format('select public.reorder_roles(%L, array(select id from public.group_roles where is_founder))', current_setting('t.g')), 'rank_too_high');

-- 10. Suppression de rôle
select pg_temp.as_user(current_setting('t.a')::uuid, format('select public.delete_role(%L)::text', current_setting('t.r')));
select pg_temp.check((select r.is_default from group_members m join group_roles r on r.id=m.role_id where m.user_id = current_setting('t.b')::uuid), 'B rebascule sur le rôle par défaut');
select pg_temp.expect_error(current_setting('t.a')::uuid, 'select public.delete_role((select id from public.group_roles where is_default))', 'default_role_locked');

-- 11. Départ du fondateur
select pg_temp.expect_error(current_setting('t.a')::uuid, format('select public.leave_group(%L)', current_setting('t.g')), 'transfer_founder_first');
select pg_temp.as_user(current_setting('t.a')::uuid, format('select public.transfer_founder(%L, %L)::text', current_setting('t.g'), current_setting('t.d')));
select pg_temp.check(public.group_member_rank(current_setting('t.g')::uuid, current_setting('t.d')::uuid) = 100, 'D devient fondateur');
select pg_temp.check(public.group_member_rank(current_setting('t.g')::uuid, current_setting('t.a')::uuid) = 80, 'A devient Admin');
select pg_temp.as_user(current_setting('t.a')::uuid, format('select public.leave_group(%L)::text', current_setting('t.g')));
select pg_temp.check(public.group_member_rank(current_setting('t.g')::uuid, current_setting('t.a')::uuid) is null, 'A a quitté');

-- 12. Journal
select pg_temp.check(pg_temp.as_user(current_setting('t.b')::uuid, 'select count(*)::text from public.group_activity_log') = '0', 'B ne voit pas le journal');
select pg_temp.check(pg_temp.as_user(current_setting('t.d')::uuid, 'select count(*)::text from public.group_activity_log')::int >= 8, 'le fondateur voit le journal');

-- 13. Groupe pro
select set_config('t.p', pg_temp.as_user(current_setting('t.e')::uuid,
  $q$select public.create_group('pro','Moto-école Bastille')::text$q$), true);
select pg_temp.check(exists(select 1 from group_roles where group_id = current_setting('t.p')::uuid and name='Gestionnaire' and not ('member.remove' = any(permissions))), 'pro : Gestionnaire sans member.remove');

-- 14. Fondateur seul qui part : groupe supprimé
select pg_temp.as_user(current_setting('t.e')::uuid, format('select public.leave_group(%L)::text', current_setting('t.p')));
select pg_temp.check(not exists(select 1 from groups where id = current_setting('t.p')::uuid), 'groupe supprimé au départ du dernier membre');
rollback;
