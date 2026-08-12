// ═══════════════════════════════════════════════════════════════
// RELAIS DU LIEN DE RÉINITIALISATION VERS L'APPLICATION.
//
// 🔴 POURQUOI CETTE PAGE EXISTE. Supabase redirigeait directement vers
// `izenride://reset-password#…`. Sur un téléphone, l'application s'ouvre.
// Depuis une boîte mail ouverte sur un ORDINATEUR — ce que fait tout le
// monde au moins une fois — le navigateur ne connaît pas le schéma
// `izenride://` : rien ne se passe, ou une page d'erreur nue. L'utilisateur
// en conclut que le lien est cassé, et comme c'est le seul chemin de
// récupération de compte, il abandonne.
//
// ⚠️ LES JETONS SONT DANS LE FRAGMENT (`#…`), ET C'EST CE QUI REND CETTE
// PAGE DÉLICATE. Un fragment ne quitte jamais le navigateur : il n'apparaît
// ni dans les journaux du serveur, ni dans l'en-tête `Referer`. Cette
// propriété est la SEULE chose qui protège le jeton — et elle est ANNULÉE
// par le moindre script tiers qui lirait `location.href`.
//
// Ce projet a déjà payé cette leçon : un jeton de partage de trajet a été
// livré à Google Tag Manager parce que le lien tombait sur une page 404
// WordPress qui chargeait GTM, lequel transmet le chemin. On n'ajoute donc
// AUCUN script tiers, AUCUNE mesure d'audience, AUCUNE police distante sur
// cette page. Le jour où quelqu'un voudra « juste ajouter un pixel », c'est
// ce commentaire qu'il doit lire d'abord.
//
// Script EN LIGNE et sans dépendance, pour la même raison.
// ═══════════════════════════════════════════════════════════════
(function () {
  var fragment = window.location.hash.slice(1);
  var p = new URLSearchParams(fragment);

  function montrer(id) {
    ['etat-ordinateur', 'etat-mobile', 'etat-expire', 'etat-absente'].forEach(function (x) {
      var el = document.getElementById(x);
      if (el) el.hidden = x !== id;
    });
  }

  // Un lien périmé ou déjà utilisé ne rend PAS d'erreur HTTP : Supabase
  // redirige ici avec `#error=…`. Sans ce cas, l'utilisateur serait envoyé
  // vers l'application pour y échouer sans comprendre.
  if (p.get('error') || p.get('error_code')) {
    montrer('etat-expire');
    return;
  }

  // Page ouverte sans jetons — lien tronqué par un client de messagerie, ou
  // simple visite. L'état par défaut dit déjà quoi faire.
  if (!p.get('access_token') || !p.get('refresh_token')) return;

  // `maxTouchPoints` plutôt que le user-agent : celui-ci est falsifié par la
  // moitié des navigateurs mobiles, et « Request desktop site » suffit à le
  // tromper. On ne cherche pas à identifier l'appareil, seulement à savoir
  // s'il vaut la peine de tenter le schéma.
  if (!(navigator.maxTouchPoints > 0)) {
    montrer('etat-ordinateur');
    return;
  }

  // Le fragment est retransmis TEL QUEL : c'est lui qui porte les jetons, et
  // l'application les relit de la même manière.
  var cible = 'izenride://reset-password#' + fragment;

  // ── ANDROID : REPLI NATIF, PAS D'HEURISTIQUE ───────────────────
  // Une URL `intent://` avec `S.browser_fallback_url` dit à Chrome quoi faire
  // si l'application est absente : il charge l'URL de repli LUI-MÊME. Aucun
  // minuteur, aucune supposition — c'est le navigateur qui sait, et lui seul.
  //
  // ⚠️ Le fragment de l'intent est réservé à sa SYNTAXE (`#Intent;…;end`), il
  // ne peut donc pas porter le nôtre. Les jetons voyagent dans l'URL de repli,
  // que Chrome charge telle quelle — d'où `?applink=absent` qui nous ramène
  // ici, fragment intact, pour afficher l'état « non installée ».
  var estAndroid = /android/i.test(navigator.userAgent);
  var replier = window.location.origin + window.location.pathname + '?applink=absent#' + fragment;

  var relance = document.getElementById('relance');
  if (relance) relance.setAttribute('href', cible);
  montrer('etat-mobile');

  // Retour du repli Android : Chrome nous a rechargés, l'app n'est pas là.
  if (new URLSearchParams(window.location.search).get('applink') === 'absent') {
    montrer('etat-absente');
    return;
  }

  if (estAndroid) {
    window.location.replace(
      'intent://reset-password#Intent;scheme=izenride;package=com.izenride.app;' +
        'S.browser_fallback_url=' +
        encodeURIComponent(replier) +
        ';end',
    );
    return;
  }

  // ── AILLEURS (iOS) : MINUTEUR DE VISIBILITÉ ────────────────────
  // Pas d'équivalent natif à `browser_fallback_url`. Le seul signal
  // disponible : si l'application s'ouvre, le navigateur passe en arrière-plan
  // et la page cesse d'être visible. Si au bout de 1,5 s elle est TOUJOURS
  // visible, c'est que rien ne s'est ouvert.
  //
  // ⚠️ Ce n'est qu'une heuristique, et elle a un mode d'échec connu : un
  // appareil très lent peut ouvrir l'app juste après l'échéance, et la
  // personne verra brièvement le mauvais message avant de basculer. On préfère
  // ce risque-là à l'inverse — laisser quelqu'un devant une page qui dit
  // « ouverture… » indéfiniment, sans jamais rien lui expliquer.
  var fini = false;
  function annuler() {
    fini = true;
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) annuler();
  });
  window.addEventListener('pagehide', annuler);
  window.addEventListener('blur', annuler);

  setTimeout(function () {
    if (!fini && !document.hidden) montrer('etat-absente');
  }, 1500);

  window.location.replace(cible);
})();
