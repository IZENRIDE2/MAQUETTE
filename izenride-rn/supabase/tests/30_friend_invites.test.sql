-- Tests du lot 3. Exécuter via supabase/tests/run.sh (Postgres local).
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

-- A fonde G1 (droit d'inviter). B fonde G2 où A est simple Membre (pas le droit d'inviter).
select set_config('t.g1', pg_temp.as_user(current_setting('t.a')::uuid, $q$select public.create_group('friends','Night Riders Paris')::text$q$), true);
select set_config('t.g2', pg_temp.as_user(current_setting('t.b')::uuid, $q$select public.create_group('friends','Café Racers 75')::text$q$), true);
insert into group_members (group_id, user_id, role_id)
select current_setting('t.g2')::uuid, current_setting('t.a')::uuid, id from group_roles
where group_id = current_setting('t.g2')::uuid and is_default;
select set_config('t.g3', pg_temp.as_user(current_setting('t.e')::uuid, $q$select public.create_group('friends','Groupe de E')::text$q$), true);

-- 1. Normalisation
select pg_temp.check(public.normalize_phone('06 12 34 56 78') = '+33612345678', 'téléphone FR -> E.164');
select pg_temp.check(public.normalize_phone('33612345678') = '+33612345678', 'téléphone au format auth.users');
select pg_temp.check(public.normalize_phone('0033 6 12 34 56 78') = '+33612345678', 'préfixe 00');
select pg_temp.check(public.normalize_phone('12') is null, 'numéro invalide rejeté');
select pg_temp.check(public.normalize_email('  Leo@Mail.FR ') = 'leo@mail.fr', 'email normalisé');

-- 2. Création
select pg_temp.expect_error(current_setting('t.a')::uuid, $q$select public.create_friend_invite('12', null, '{}')$q$, 'invalid_phone');
select pg_temp.expect_error(current_setting('t.a')::uuid, $q$select public.create_friend_invite(null, 'pas-un-email', '{}')$q$, 'invalid_email');
select pg_temp.expect_error(current_setting('t.a')::uuid, format('select public.create_friend_invite(null, null, array[%L]::uuid[])', current_setting('t.g3')), 'not_member');
select set_config('t.i1', pg_temp.as_user(current_setting('t.a')::uuid, format(
  'select public.create_friend_invite(''06 12 34 56 78'', null, array[%L, %L]::uuid[]) ->> ''id''', current_setting('t.g1'), current_setting('t.g2'))), true);
select pg_temp.check((select code ~ '^[A-HJ-NP-Z2-9]{8}$' from friend_invites where id = current_setting('t.i1')::uuid), 'code de 8 caractères sans I ni O');
select pg_temp.check((select phone_hash = public.contact_hash('+33612345678') and phone_hash <> '+33612345678' from friend_invites where id = current_setting('t.i1')::uuid), 'téléphone stocké en empreinte, jamais en clair');
select pg_temp.check(pg_temp.as_user(current_setting('t.a')::uuid, 'select has_phone::text from public.my_friend_invites()') = 'true', 'l’inviteur voit « téléphone renseigné »');
select pg_temp.expect_error(current_setting('t.a')::uuid, 'select phone_hash from public.friend_invites', 'permission denied for table friend_invites');
select pg_temp.expect_error(current_setting('t.a')::uuid, $q$select public.contact_hash('+33612345678')$q$, 'permission denied for function contact_hash');

-- 3. Rattachement : rien sans code ni contact vérifié
select pg_temp.check(pg_temp.as_user(current_setting('t.c')::uuid, 'select public.claim_friend_invite() ->> ''status''') = 'none', 'sans code ni contact vérifié : pas de rattachement');
update auth.users set phone = '33612345678' where id = current_setting('t.c')::uuid;
select pg_temp.check(pg_temp.as_user(current_setting('t.c')::uuid, 'select public.claim_friend_invite() ->> ''status''') = 'none', 'téléphone non vérifié : pas de rattachement');

-- 4. Rattachement par téléphone vérifié + groupes mémorisés
update auth.users set phone_confirmed_at = now() where id = current_setting('t.c')::uuid;
select set_config('t.claim', pg_temp.as_user(current_setting('t.c')::uuid, 'select public.claim_friend_invite()::text'), true);
select pg_temp.check(current_setting('t.claim')::jsonb ->> 'via' = 'contact', 'rattaché par téléphone vérifié');
select pg_temp.check((select mode from jsonb_to_recordset(current_setting('t.claim')::jsonb -> 'groups') as x(group_id uuid, mode text)
                      where group_id = current_setting('t.g1')::uuid) = 'invite', 'G1 : invitation directe (l’inviteur peut inviter)');
select pg_temp.check((select mode from jsonb_to_recordset(current_setting('t.claim')::jsonb -> 'groups') as x(group_id uuid, mode text)
                      where group_id = current_setting('t.g2')::uuid) = 'suggestion', 'G2 : suggestion « Membre » (l’inviteur ne peut pas inviter)');
select pg_temp.check((select phone_hash is null and email_hash is null from friend_invites where id = current_setting('t.i1')::uuid), 'empreintes effacées au rattachement');
select pg_temp.check(pg_temp.as_user(current_setting('t.c')::uuid, 'select public.claim_friend_invite() ->> ''status''') = 'already_claimed', 'rattachement idempotent');
select pg_temp.check(pg_temp.as_user(current_setting('t.c')::uuid,
  'select string_agg(g ->> ''status'', '','' order by g ->> ''name'') from jsonb_array_elements(public.my_invitation() -> ''groups'') g') = 'pending_approval,invited',
  'onboarding : G2 en attente de validation, G1 invité');

-- 5. Rattachement par code (insensible à la casse), code déjà utilisé, propre code
select set_config('t.code1', (select code from friend_invites where id = current_setting('t.i1')::uuid), true);
select pg_temp.check(pg_temp.as_user(current_setting('t.d')::uuid, format('select public.claim_friend_invite(%L) ->> ''status''', current_setting('t.code1'))) = 'none', 'code déjà utilisé : refusé');
select set_config('t.i2', pg_temp.as_user(current_setting('t.a')::uuid, 'select public.create_friend_invite() ->> ''code'''), true);
select pg_temp.check(pg_temp.as_user(current_setting('t.a')::uuid, format('select public.claim_friend_invite(%L) ->> ''status''', current_setting('t.i2'))) = 'none', 'on ne peut pas utiliser son propre code');
select pg_temp.check(pg_temp.as_user(current_setting('t.d')::uuid, format('select public.claim_friend_invite(%L) ->> ''via''', lower(current_setting('t.i2')))) = 'code', 'rattaché par code, casse ignorée');

-- 6. Messages 1-1 de bienvenue
select pg_temp.check(pg_temp.as_user(current_setting('t.a')::uuid, format('select public.send_direct_message(%L, ''text'', ''Bienvenue !'') is not null', current_setting('t.c')))::boolean, 'message de bienvenue envoyé');
select pg_temp.check(pg_temp.as_user(current_setting('t.a')::uuid, format('select public.send_direct_message(%L, ''wave'') is not null', current_setting('t.c')))::boolean, '« V » de motard envoyé');
select pg_temp.expect_error(current_setting('t.a')::uuid, format('select public.send_direct_message(%L, ''ride'', null, ''{"title":"Ride","starts_at":"2020-01-01","meeting_point":"Bastille"}'')', current_setting('t.c')), 'invalid_payload');
select pg_temp.check(pg_temp.as_user(current_setting('t.a')::uuid, format(
  'select public.send_direct_message(%L, ''ride'', null, jsonb_build_object(''title'',''Ride à deux'',''starts_at'',now()+interval ''2 days'',''meeting_point'',''Bastille'')) is not null',
  current_setting('t.c')))::boolean, 'sortie à deux proposée');
select pg_temp.expect_error(current_setting('t.c')::uuid, format('select public.send_direct_message(%L, ''text'', ''Salut'')', current_setting('t.e')), 'forbidden');
select pg_temp.check(pg_temp.as_user(current_setting('t.c')::uuid, 'select count(*)::text from public.direct_messages') = '3', 'l’ami voit ses 3 messages');
select pg_temp.check(pg_temp.as_user(current_setting('t.e')::uuid, 'select count(*)::text from public.direct_messages') = '0', 'un tiers ne voit rien');

-- 7. Bienvenue marquée
select pg_temp.as_user(current_setting('t.a')::uuid, format('select public.mark_friend_welcomed(%L)::text', current_setting('t.i1')));
select pg_temp.check((select welcomed_at is not null from friend_invites where id = current_setting('t.i1')::uuid), 'bienvenue marquée');

-- 8. « Ce n'est pas moi »
select pg_temp.as_user(current_setting('t.c')::uuid, 'select public.unlink_friend_invite()::text');
select pg_temp.check((select status from friend_invites where id = current_setting('t.i1')::uuid) = 'unlinked', 'rattachement annulé par l’ami');
select pg_temp.check((select status from group_invites where invitee_id = current_setting('t.c')::uuid and group_id = current_setting('t.g1')::uuid) = 'declined', 'invitation de groupe annulée');
select pg_temp.check((select status::text from group_suggestions where group_id = current_setting('t.g2')::uuid and payload ->> 'user_id' = current_setting('t.c')) = 'withdrawn', 'suggestion de membre retirée');

-- 9. Gestion par l'inviteur : groupes, relance, annulation, expiration
select set_config('t.i3', pg_temp.as_user(current_setting('t.a')::uuid, 'select public.create_friend_invite(null, ''nora@mail.fr'') ->> ''id'''), true);
select pg_temp.as_user(current_setting('t.a')::uuid, format('select public.update_friend_invite_groups(%L, array[%L]::uuid[])::text', current_setting('t.i3'), current_setting('t.g1')));
select pg_temp.check((select preset_group_ids = array[current_setting('t.g1')::uuid] from friend_invites where id = current_setting('t.i3')::uuid), 'groupes mémorisés modifiables avant l’inscription');
select pg_temp.expect_error(current_setting('t.b')::uuid, format('select public.cancel_friend_invite(%L)', current_setting('t.i3')), 'friend_invite_not_found');
update friend_invites set expires_at = now() - interval '1 minute' where id = current_setting('t.i3')::uuid;
select pg_temp.check(public.expire_friend_invites() = 1, 'expiration automatique');
select pg_temp.check((select email_hash is null from friend_invites where id = current_setting('t.i3')::uuid), 'empreinte purgée à expiration');
select pg_temp.as_user(current_setting('t.a')::uuid, format('select public.renew_friend_invite(%L)::text', current_setting('t.i3')));
select pg_temp.check((select status = 'pending' and expires_at > now() + interval '29 days' from friend_invites where id = current_setting('t.i3')::uuid), 'relance : 30 jours de plus');
select pg_temp.as_user(current_setting('t.a')::uuid, format('select public.cancel_friend_invite(%L)::text', current_setting('t.i3')));
select pg_temp.check((select status from friend_invites where id = current_setting('t.i3')::uuid) = 'cancelled', 'invitation annulée');

-- 10. Rattachement par email vérifié, invitation la plus récente
select pg_temp.as_user(current_setting('t.a')::uuid, 'select public.create_friend_invite(null, ''hugo@mail.fr'')::text');
-- Même transaction = même now() : on vieillit la première invitation.
update friend_invites set created_at = now() - interval '1 hour' where phone_hash is null and email_hash = public.contact_hash('hugo@mail.fr');
select set_config('t.i5', pg_temp.as_user(current_setting('t.b')::uuid, 'select public.create_friend_invite(null, ''Hugo@Mail.fr'') ->> ''id'''), true);
update auth.users set email = 'hugo@mail.fr', email_confirmed_at = now() where id = current_setting('t.e')::uuid;
select pg_temp.check(pg_temp.as_user(current_setting('t.e')::uuid, 'select public.claim_friend_invite() ->> ''inviter_id''') = current_setting('t.b'), 'email vérifié : l’invitation la plus récente gagne');
rollback;
