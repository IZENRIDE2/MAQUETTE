// ═══════════════════════════════════════════════════════════════
// LIEN DE RÉINITIALISATION : RELAIS VERS L'APPLICATION, FORMULAIRE EN SECOURS.
//
// 🔴 POURQUOI CETTE PAGE EXISTE. Supabase redirigeait directement vers
// `izenride://reset-password#…`. Sur un téléphone, l'application s'ouvre.
// Depuis une boîte mail ouverte sur un ORDINATEUR — ce que fait tout le
// monde au moins une fois — le navigateur ne connaît pas le schéma
// `izenride://` : rien ne se passe, ou une page d'erreur nue. L'utilisateur
// en conclut que le lien est cassé, et comme c'est le seul chemin de
// récupération de compte, il abandonne.
//
// 🔴 ET LE RELAIS SEUL NE SUFFISAIT PAS. Il ouvre l'application quand elle
// est là ; sinon il ne restait qu'un message « ouvrez ce lien sur votre
// téléphone », c'est-à-dire un cul-de-sac pour qui lit ses mails sur un
// ordinateur. D'où le formulaire de secours, repris du travail d'IzenRide
// Dev : il change le mot de passe ici même, MAIS uniquement là où le relais
// ne peut pas aboutir. Sur un mobile équipé, l'application reste prioritaire
// — c'est elle qui sait ouvrir une session.
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
// Script EN LIGNE et sans dépendance, pour la même raison. Il est SERVI en
// fichier séparé et non embarqué dans le HTML : la CSP du site interdit
// `unsafe-inline` (`vercel.json`, `script-src 'self'`).
// ═══════════════════════════════════════════════════════════════
(function () {
  // Projet Supabase qui émet les liens de récupération. La clé anon est
  // publique par conception : elle n'ouvre que ce que les politiques RLS
  // autorisent, et tout client de l'application l'embarque déjà. La clé
  // `service_role`, qui elle contourne le RLS, n'a rien à faire ici.
  //
  // ⚠️ CETTE ORIGINE EST AUSSI DÉCLARÉE DANS LA CSP (`vercel.json`,
  // `connect-src`). Changer de projet sans y toucher ferait échouer l'appel
  // au niveau du navigateur, avant même d'atteindre le réseau — et le
  // symptôme ressemblerait à une panne de connexion.
  var SUPABASE_URL = 'https://onzmjiykvdhhqwvebaqg.supabase.co';
  var SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uem1qaXlrdmRoaHF3dmViYXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjcxNzcsImV4cCI6MjA5MjY0MzE3N30.YqXmMQBjMiudy_RWWDfxD49wBb50IkXESsAXeIvPS4U';

  var fragment = window.location.hash.slice(1);
  var p = new URLSearchParams(fragment);

  var ETATS = [
    'etat-defaut',
    'etat-ordinateur',
    'etat-mobile',
    'etat-absente',
    'etat-expire',
    'etat-autre-projet',
  ];

  function montrer(id) {
    ETATS.forEach(function (x) {
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
  // simple visite. L'état par défaut dit déjà quoi faire, et surtout il ne
  // promet aucun formulaire.
  var jeton = p.get('access_token');
  if (!jeton || !p.get('refresh_token')) return;

  // ── LE FORMULAIRE DE SECOURS ───────────────────────────────────

  // De quel projet Supabase ce jeton vient-il ? La réponse est dans sa
  // charge utile (`iss`). On la lit pour une seule raison : si le lien vient
  // d'un autre environnement, l'appel serait bloqué par la CSP et l'écran
  // afficherait « réseau indisponible » — un diagnostic faux, sur lequel
  // personne ne peut agir. Mieux vaut dire la vérité et renvoyer vers
  // l'application, qui sait traiter n'importe quel environnement.
  //
  // Lecture par expression régulière plutôt que `JSON.parse` : `atob` rend
  // une chaîne d'octets, et un simple accent dans une autre revendication
  // (un e-mail, par exemple) suffirait à faire échouer l'analyse — alors que
  // `iss` est toujours en ASCII.
  function projetDuJeton(jwt) {
    try {
      var charge = String(jwt).split('.')[1];
      if (!charge) return null;
      var b64 = charge.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      var trouve = window.atob(b64).match(/"iss"\s*:\s*"([^"]+)"/);
      return trouve ? trouve[1].replace(/\/auth\/v1\/?$/, '') : null;
    } catch (e) {
      return null;
    }
  }

  // Les mêmes cinq règles que l'écran de l'application
  // (`apps/mobile/lib/auth/password-rules.ts`). Elles sont dupliquées ici
  // faute de code partagé entre les deux dépôts : si elles changent là-bas,
  // ce fichier est à reprendre à la main. Un mot de passe accepté ici et
  // refusé par l'application serait pire que pas de formulaire du tout.
  var REGLES = {
    longueur: function (v) {
      return v.length >= 8;
    },
    majuscule: function (v) {
      return /[A-Z]/.test(v);
    },
    minuscule: function (v) {
      return /[a-z]/.test(v);
    },
    chiffre: function (v) {
      return /\d/.test(v);
    },
    special: function (v) {
      return /[^A-Za-z0-9]/.test(v);
    },
  };

  function cabler(acces) {
    var form = document.getElementById('form');
    var mdp = document.getElementById('motdepasse');
    var confirmation = document.getElementById('confirmation');
    var message = document.getElementById('message');
    var valider = document.getElementById('valider');
    var criteres = document.getElementById('criteres');
    var enregistre = document.getElementById('enregistre');
    if (!form || !mdp || !confirmation || !valider || !criteres) return;

    function evaluer(v) {
      var toutes = true;
      Array.prototype.forEach.call(criteres.children, function (li) {
        var regle = REGLES[li.getAttribute('data-regle')];
        var ok = typeof regle === 'function' && regle(v);
        if (ok) li.classList.add('ok');
        else li.classList.remove('ok');
        if (!ok) toutes = false;
      });
      return toutes;
    }

    mdp.addEventListener('input', function () {
      evaluer(mdp.value);
    });

    form.addEventListener('submit', function (evenement) {
      evenement.preventDefault();
      message.textContent = '';

      var v = mdp.value;
      if (!evaluer(v)) {
        message.textContent = 'Le mot de passe ne remplit pas encore les cinq conditions ci-dessus.';
        return;
      }
      if (v !== confirmation.value) {
        message.textContent = 'Les deux saisies diffèrent.';
        return;
      }

      valider.disabled = true;
      valider.textContent = 'Enregistrement…';

      function rendreLaMain() {
        valider.disabled = false;
        valider.textContent = 'Enregistrer';
      }

      // Le jeton de récupération sert d'autorisation : c'est lui, et lui
      // seul, qui prouve que la personne a reçu le courriel.
      fetch(SUPABASE_URL + '/auth/v1/user', {
        method: 'PUT',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: 'Bearer ' + acces,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: v }),
      })
        .then(function (reponse) {
          return reponse
            .json()
            .catch(function () {
              return {};
            })
            .then(function (charge) {
              return { ok: reponse.ok, statut: reponse.status, charge: charge };
            });
        })
        .then(function (r) {
          if (!r.ok) {
            // On remonte le message de Supabase tel quel : un lien expiré
            // pendant la saisie, une règle de mot de passe côté serveur, un
            // jeton déjà consommé n'ont pas la même réponse, et les fondre
            // dans un « échec » générique priverait la personne du seul
            // indice exploitable.
            message.textContent =
              r.charge.msg ||
              r.charge.error_description ||
              r.charge.message ||
              'Échec (HTTP ' + r.statut + ').';
            rendreLaMain();
            return;
          }
          form.hidden = true;
          if (enregistre) enregistre.hidden = false;
        })
        .catch(function (erreur) {
          message.textContent =
            "La demande n'a pas pu partir (" +
            erreur.message +
            '). Réessayez, ou ouvrez ce lien depuis le téléphone où IzenRide est installée.';
          rendreLaMain();
        });
    });
  }

  function proposerFormulaire(acces) {
    var projet = projetDuJeton(acces);
    if (projet && projet !== SUPABASE_URL) {
      montrer('etat-autre-projet');
      return;
    }

    // Le jeton ne doit pas rester dans la barre d'adresse : il finirait dans
    // l'historique du navigateur et dans le moindre partage d'écran. On ne
    // l'efface qu'ICI, jamais avant : les chemins de relais ont besoin du
    // fragment intact, et le repli Android le fait même transiter par une
    // seconde URL.
    window.history.replaceState(null, '', window.location.pathname);

    var repli = document.getElementById('repli');
    if (repli) repli.hidden = false;
    cabler(acces);
  }

  // ── LE RELAIS VERS L'APPLICATION ───────────────────────────────

  // `maxTouchPoints` plutôt que le user-agent : celui-ci est falsifié par la
  // moitié des navigateurs mobiles, et « Request desktop site » suffit à le
  // tromper. On ne cherche pas à identifier l'appareil, seulement à savoir
  // s'il vaut la peine de tenter le schéma.
  if (!(navigator.maxTouchPoints > 0)) {
    montrer('etat-ordinateur');
    proposerFormulaire(jeton);
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
    proposerFormulaire(jeton);
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
    if (!fini && !document.hidden) {
      montrer('etat-absente');
      proposerFormulaire(jeton);
    }
  }, 1500);

  window.location.replace(cible);
})();
