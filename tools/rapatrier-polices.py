# -*- coding: utf-8 -*-
"""
Rapatrie les polices et les scripts tiers dans le dépôt.

═══════════════════════════════════════════════════════════════════════
🔴 POURQUOI — CONFORMITÉ RGPD

La page appelait `api.fontshare.com`, `fonts.googleapis.com` et
`cdn.jsdelivr.net` au chargement. Chacun de ces appels transmet
l'ADRESSE IP du visiteur à un tiers, avant tout consentement. Une
adresse IP est une donnée personnelle : c'est très exactement ce que la
justice européenne a sanctionné dans les affaires Google Fonts.

Un bandeau de consentement n'aurait été qu'un pansement. Il aurait fallu
bloquer les polices jusqu'à acceptation — donc afficher une page sans sa
typographie à qui refuse — et le problème serait resté entier pour tous
ceux qui cliquent « accepter » sans lire.

En hébergeant ces fichiers, il n'y a plus rien à consentir : zéro requête
tierce. Le site ne pose par ailleurs aucun cookie de suivi ; il n'écrit
que `izen-lang` et `izen-intro`, deux valeurs strictement fonctionnelles
qui n'exigent pas de consentement.

Bénéfices annexes : la page charge plus vite, et le site cesse de
dépendre d'un CDN dont son propre README admettait qu'il le dégradait.

═══════════════════════════════════════════════════════════════════════
Deux pièges rencontrés, notés pour la prochaine fois :

  • Google Fonts renvoie du TTF (trois fois plus lourd) si l'on ne
    présente pas un User-Agent moderne. D'où l'en-tête ci-dessous.
  • Fontshare sert des URL RELATIVES AU PROTOCOLE (`//cdn.fontshare.com`),
    pas `https://`. Une expression qui n'attend que `https://` rend zéro
    fichier — et zéro fichier ressemble à « il n'y en a pas », pas à
    « je n'ai pas su lire ». Le script COMPTE et affiche donc ce qu'il
    trouve, pour que le silence ne passe pas pour un succès.

Usage :  python tools/rapatrier-polices.py
"""

import io
import os
import re
import urllib.request

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOSSIER_POLICES = os.path.join(RACINE, "assets", "fonts")
DOSSIER_JS = os.path.join(RACINE, "js", "vendor")

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/126.0 Safari/537.36"
)

FEUILLES = {
    "Fontshare — Clash Display + Satoshi": (
        "https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700"
        "&f[]=satoshi@400,500,700&display=swap"
    ),
    "Google Fonts — JetBrains Mono": (
        "https://fonts.googleapis.com/css2?family=JetBrains+Mono"
        ":ital,wght@0,400;0,500;1,400&display=swap"
    ),
}

SCRIPTS = [
    "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js",
    "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js",
]

# Accepte `https://…`, `//…`, avec ou sans guillemets.
MOTIF_URL = re.compile(r"url\(\s*['\"]?((?:https:)?//[^)'\"]+)['\"]?\s*\)")


def telecharger(url, binaire=False):
    if url.startswith("//"):
        url = "https:" + url
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    donnees = urllib.request.urlopen(req, timeout=90).read()
    return donnees if binaire else donnees.decode("utf-8")


def traiter_feuille(nom, url):
    css = telecharger(url)
    liens = sorted(set(MOTIF_URL.findall(css)))
    if not liens:
        raise SystemExit(
            f"AUCUNE police trouvée dans « {nom} ». Ce n'est pas normal : la "
            "feuille a répondu mais son format a changé. Vérifier MOTIF_URL "
            "plutôt que de laisser passer un fichier vide."
        )

    # On ne garde que le WOFF2 : supporté par tous les navigateurs depuis
    # 2016, et deux à trois fois plus léger que WOFF ou TTF. Les autres
    # formats sont retirés de la déclaration `src`.
    gardes = 0
    for lien in liens:
        base = os.path.basename(lien.split("?")[0])
        if not base.endswith(".woff2"):
            continue
        chemin = os.path.join(DOSSIER_POLICES, base)
        if not os.path.exists(chemin):
            io.open(chemin, "wb").write(telecharger(lien, binaire=True))
        css = css.replace(lien, f"../assets/fonts/{base}")
        gardes += 1

    # Retire les sources non-WOFF2 devenues des liens tiers orphelins.
    css = re.sub(
        r",?\s*url\(\s*['\"]?(?:https:)?//[^)'\"]+['\"]?\s*\)\s*format\("
        r"['\"](?:woff|truetype|opentype)['\"]\s*\)",
        "",
        css,
    )
    print(f"  {nom} : {gardes} police(s) WOFF2 rapatriée(s) sur {len(liens)} lien(s)")
    return f"/* ── {nom} ── */\n{css.strip()}\n"


ENTETE = """/* ═══════════════════════════════════════════════════════════════
   Polices hébergées CHEZ NOUS — conformité RGPD.

   Aucune requête vers un tiers : ni Google, ni Fontshare. L'adresse IP du
   visiteur ne quitte pas le domaine. Voir tools/rapatrier-polices.py pour
   le détail du raisonnement.

   ⚠️ FICHIER GÉNÉRÉ. Pour changer une graisse, modifier les URL dans
   tools/rapatrier-polices.py et rejouer le script — ne pas éditer ici.
   ═══════════════════════════════════════════════════════════════ */

"""


def main():
    os.makedirs(DOSSIER_POLICES, exist_ok=True)
    os.makedirs(DOSSIER_JS, exist_ok=True)

    blocs = [traiter_feuille(nom, url) for nom, url in FEUILLES.items()]
    io.open(
        os.path.join(RACINE, "css", "fonts.css"), "w", encoding="utf-8", newline="\n"
    ).write(ENTETE + "\n".join(blocs))

    poids = sum(
        os.path.getsize(os.path.join(DOSSIER_POLICES, f))
        for f in os.listdir(DOSSIER_POLICES)
    )
    print(f"  css/fonts.css écrit — {poids / 1024:.0f} Ko de polices au total")

    for url in SCRIPTS:
        base = os.path.basename(url)
        chemin = os.path.join(DOSSIER_JS, base)
        if os.path.exists(chemin):
            print(f"  js/vendor/{base} — déjà présent")
            continue
        octets = telecharger(url, binaire=True)
        io.open(chemin, "wb").write(octets)
        print(f"  js/vendor/{base} — {len(octets) / 1024:.0f} Ko")


if __name__ == "__main__":
    main()
