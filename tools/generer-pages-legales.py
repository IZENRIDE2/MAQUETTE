# -*- coding: utf-8 -*-
"""
Génère les pages légales statiques du site immersif à partir du contenu
WordPress déjà publié.

═══════════════════════════════════════════════════════════════════════
POURQUOI CE SCRIPT PLUTÔT QU'UNE RÉÉCRITURE À LA MAIN

Le texte de ces pages est juridique. On le PORTE, on ne le réécrit pas :
la seule chose qui change est l'habillage. Un script rend le report
reproductible et vérifiable — on peut rejouer et comparer.

═══════════════════════════════════════════════════════════════════════
🔴 CE QUI N'EST DÉLIBÉRÉMENT PAS PORTÉ

Trois pages portent un MÉCANISME VIVANT, pas seulement du texte. Les
figer en HTML statique produirait une interface qui ment : elle
s'afficherait, et ne ferait rien.

  • /contact/              → formulaire WordPress
  • /suppresion-compte/    → formulaire + script. C'est le mécanisme de
                             demande de suppression DÉCLARÉ À GOOGLE dans
                             le formulaire « Sécurité des données ».
  • /politique-de-cookies-ue/ → cases de consentement Complianz, pilotées
                             par son JavaScript.

Elles restent servies par WordPress. Ça marche parce que la réécriture
WordPress ne se déclenche que pour les chemins SANS fichier réel : tant
qu'on ne dépose pas de fichier à ces adresses, elles répondent.

⚠️ COROLLAIRE : ne jamais générer ces trois pages ici. Le fichier
gagnerait contre WordPress, et le formulaire mourrait en silence.

═══════════════════════════════════════════════════════════════════════
Usage :  python tools/generer-pages-legales.py
"""

import html
import io
import json
import os
import re
import urllib.request

BASE = "https://www.izenride.com"
RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Uniquement du texte. Voir l'en-tête pour ce qui est exclu, et pourquoi.
PAGES = [
    "mentions-legales",
    "politique-de-confidentialite",
    "conditions-generales-dutilisation-cgu",
    "conditions-generales-de-vente",
]

# Les pages qui restent à WordPress — listées ici pour que le lecteur voie
# l'ensemble, et pour la garde qui vérifie qu'on ne les génère jamais.
NON_PORTEES = ["contact", "suppresion-compte", "politique-de-cookies-ue"]

LIENS_PIED = [
    ("/mentions-legales/", "Mentions légales"),
    ("/politique-de-confidentialite/", "Politique de confidentialité"),
    ("/conditions-generales-dutilisation-cgu/", "CGU"),
    ("/conditions-generales-de-vente/", "CGV"),
    ("/politique-de-cookies-ue/", "Cookies"),
    ("/suppresion-compte/", "Supprimer mon compte"),
    ("/contact/", "Contact"),
]

# ── Corrections de fond, établies le 2026-08-04 ────────────────────────
#
# La politique publiée AFFIRMAIT deux choses fausses, et c'est plus grave
# qu'une omission : elle niait des collectes que l'application déclare par
# ailleurs à Google.
#
#   • « ne permettent pas de déterminer le domicile des Utilisateurs »
#     → l'application demande et enregistre l'adresse du domicile pour
#       délimiter la zone de confidentialité.
#   • « empêcher à ses Utilisateurs d'être géolocalisés précisément »
#     → la déclaration Sécurité des données coche « Position exacte ».
#
# S'y ajoutait une omission : les rapports de plantage (Sentry).
APO = r"(?:['’]|&rsquo;|&#8217;|&#039;)"

CORRECTIONS_CONFIDENTIALITE = [
    (
        # Le paragraphe fautif, reconnu sur son ossature (la ponctuation et
        # les apostrophes typographiques varient selon l'éditeur WordPress).
        r"En conséquence,\s*le service IZEN\s*RIDE utilise des traceurs de géolocalisation qui ne "
        r"permettent pas de déterminer le domicile des Utilisateurs,\s*mais seulement leur présence "
        r"dans une aire géographique déterminée,\s*suffisamment large pour empêcher à ses "
        r"Utilisateurs d" + APO + r"être géolocalisés précisément\.",
        "À cette fin, l’application collecte des données de géolocalisation précises, nécessaires "
        "au guidage GPS, à la détection des croisements et à l’alerte SOS. Cette collecte a lieu "
        "pendant l’utilisation de l’application ; pendant un guidage actif, elle se poursuit "
        "lorsque l’application passe en arrière-plan, ce qui est alors signalé par une "
        "notification permanente. L’Utilisateur garde la maîtrise de ce qui est communiqué aux "
        "autres membres : il choisit dans ses réglages le niveau de précision de la position "
        "partagée — précise, approximative, très floue, ou masquée — et peut définir une zone de "
        "confidentialité autour de son domicile, à l’intérieur de laquelle sa position n’est pas "
        "partagée.",
    ),
    (
        r"(L" + APO + r"utilisation des prestations prévues sur la Plateforme permet de renseigner un "
        r"profil,\s*pouvant comprendre une adresse et un numéro de téléphone\.)",
        r"\1 L’Utilisateur peut également renseigner l’adresse de son domicile, à seule fin de "
        r"délimiter une zone de confidentialité à l’intérieur de laquelle sa position n’est pas "
        r"partagée. Cette adresse n’est communiquée à aucun autre Utilisateur. "
        r"L’application transmet par ailleurs des rapports de plantage au prestataire Sentry, "
        r"lorsque l’Utilisateur y consent, à seule fin de diagnostiquer les dysfonctionnements ; "
        r"ces rapports ne contiennent pas de données permettant de l’identifier, et le "
        r"consentement est révocable à tout moment depuis les réglages de l’application.",
    ),
]


# ── Le prix, et la seule source qui fait foi ───────────────────────────
#
# Trois documents annonçaient trois prix différents le 2026-08-04 :
#   • la page d'accueil du site   : 4,99 € / mois, 49,99 € / an
#   • ces CGV publiées WordPress  : « FORFAIT ZEN à 7,99 € »
#   • les CGV de l'APPLICATION    : 9,99 € / mois, 49,99 € / 6 mois,
#                                   79,99 € / an
#
# Décision de l'auteur du projet : **les CGV de l'application font foi**,
# les autres s'alignent. Source :
#   C:/Izen-ride/Izenride Demo/apps/mobile/lib/legal/content/cgv.ts:73-75
#
# ⚠️ La page WordPress d'origine porte TOUJOURS 7,99 €. Cette correction ne
# la modifie pas — elle corrige la page publiée. À reprendre dans WordPress
# pour que la source et le publié cessent de diverger.
CORRECTIONS_CGV = [
    (
        r"ABONNEMENT FORFAIT ZEN à 7,99\s*€",
        "ABONNEMENT FORFAIT ZEN — 9,99 € / mois, 49,99 € / 6 mois "
        "(soit 8,33 € / mois), ou 79,99 € / an (soit 6,67 € / mois)",
    ),
]

CORRECTIONS_PAR_PAGE = {
    "politique-de-confidentialite": CORRECTIONS_CONFIDENTIALITE,
    "conditions-generales-de-vente": CORRECTIONS_CGV,
}


def recuperer(slug):
    url = f"{BASE}/wp-json/wp/v2/pages?slug={slug}&_fields=title,content,modified"
    req = urllib.request.Request(url, headers={"User-Agent": "izenride-port/1.0"})
    donnees = json.load(urllib.request.urlopen(req, timeout=60))
    if not donnees:
        raise SystemExit(f"page introuvable : {slug}")
    p = donnees[0]
    titre = html.unescape(re.sub("<[^>]+>", "", p["title"]["rendered"])).strip()
    return titre, p["content"]["rendered"], p.get("modified", "")[:10]


def nettoyer(contenu):
    """Retire ce qui n'a pas de sens hors de WordPress, garde la sémantique."""
    c = re.sub(r"<script.*?</script>", "", contenu, flags=re.S | re.I)
    c = re.sub(r"<style.*?</style>", "", c, flags=re.S | re.I)
    c = re.sub(r"<!--.*?-->", "", c, flags=re.S)
    # Codes courts non interprétés (« [vc_row] » et compagnie).
    c = re.sub(r"\[/?[a-z0-9_]+[^\]]*\]", "", c, flags=re.I)
    # Attributs de présentation propres au thème WordPress.
    c = re.sub(r'\s(?:style|class|id|data-[a-z-]+)="[^"]*"', "", c, flags=re.I)
    # Les <div> et <section> vides une fois dépouillés n'apportent rien.
    c = re.sub(r"</?(?:div|section|span)>", "", c, flags=re.I)
    c = re.sub(r"\n{3,}", "\n\n", c)
    return c.strip()


def corriger(slug, contenu):
    corrections = CORRECTIONS_PAR_PAGE.get(slug)
    if not corrections:
        return contenu, []
    appliquees = []
    for motif, remplacement in corrections:
        nouveau, n = re.subn(motif, remplacement, contenu, count=1)
        if n:
            appliquees.append(motif[:52] + "…")
            contenu = nouveau
    return contenu, appliquees


def gabarit(titre, corps, maj):
    pied = "\n".join(
        f'        <a href="{u}">{n}</a>' for u, n in LIENS_PIED
    )
    return f"""<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(titre)} — IZEN RIDE</title>
  <meta name="description" content="{html.escape(titre)} de IZEN RIDE, l’application des motards.">
  <!-- Polices hébergées chez nous : aucune requête tierce. -->
  <link rel="stylesheet" href="/css/fonts.css">
  <link rel="stylesheet" href="/css/styles.css">
  <link rel="stylesheet" href="/css/legal.css">
</head>
<body class="legal">
  <header class="legal__head">
    <a class="legal__back" href="/">← IZEN RIDE</a>
  </header>

  <main class="legal__main">
    <h1 class="legal__title">{html.escape(titre)}</h1>
    <p class="legal__meta mono">Dernière mise à jour : {maj}</p>
    <article class="legal__body">
{corps}
    </article>
  </main>

  <footer class="footer footer--legal mono" aria-label="Informations légales">
{pied}
  </footer>
</body>
</html>
"""


def main():
    for interdit in NON_PORTEES:
        if interdit in PAGES:
            raise SystemExit(
                f"REFUS : « {interdit} » porte un mécanisme vivant (formulaire ou "
                "consentement). La générer ici la ferait gagner contre WordPress, "
                "et le mécanisme mourrait en silence. Voir l'en-tête du fichier."
            )

    for slug in PAGES:
        titre, brut, maj = recuperer(slug)
        corps = nettoyer(brut)
        corps, appliquees = corriger(slug, corps)
        dossier = os.path.join(RACINE, slug)
        os.makedirs(dossier, exist_ok=True)
        chemin = os.path.join(dossier, "index.html")
        io.open(chemin, "w", encoding="utf-8", newline="\n").write(
            gabarit(titre, corps, maj)
        )
        note = f"  (+{len(appliquees)} correction(s))" if appliquees else ""
        print(f"  {slug}/index.html — {len(corps)} car.{note}")
        for a in appliquees:
            print(f"      corrigé : {a}")

    print(f"\n  laissées à WordPress : {', '.join(NON_PORTEES)}")


if __name__ == "__main__":
    main()
