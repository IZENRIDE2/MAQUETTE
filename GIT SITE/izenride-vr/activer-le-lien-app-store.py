#!/usr/bin/env python3
"""Activer le lien App Store — mais SEULEMENT si la fiche sert bien la 3.1.0.

═══════════════════════════════════════════════════════════════
🔴 POURQUOI CE SCRIPT PLUTOT QU'UN COMMENTAIRE.

Le bloc `#beta` d'`index.html` porte deja le remplacement exact et la commande
de controle. Il demande de « verifier d'abord ». Un commentaire qui demande de
verifier ne verifie rien : il compte sur quelqu'un qui lit jusqu'au bout, un
jour ou il sera presse d'annoncer la sortie.

Or l'erreur qu'il previent est precise et couteuse : la fiche Apple sert encore
la **3.0.7 du 18 novembre 2025**, c'est-a-dire l'ANCIENNE application Flutter.
Activer le lien avant l'approbation enverrait chaque visiteur installer un autre
produit que celui decrit sur la page — avec ses 2,6 etoiles heritees.

Ce script REFUSE tant que l'App Store ne sert pas la version attendue. C'est la
meme discipline que le reste du projet : la garde vit dans la commande, pas dans
la prose.

═══════════════════════════════════════════════════════════════
Usage :
    python activer-le-lien-app-store.py            # verifie, puis modifie
    python activer-le-lien-app-store.py --controler # verifie seulement

Sortie 0 = lien active (ou deja actif).
Sortie 1 = la fiche ne sert pas encore la version attendue — RIEN n'a change.
Sortie 2 = le bloc attendu est introuvable dans index.html.

⚠️ Ce script NE DEPLOIE PAS. Apres lui :
       npx vercel --prod          (depuis ce dossier, SANS --token)
"""

from __future__ import annotations

import argparse
import json
import pathlib
import re
import sys
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

ICI = pathlib.Path(__file__).resolve().parent
INDEX = ICI / "index.html"

APP_ID = "6476877458"
VERSION_ATTENDUE = "3.1.0"

# Le navigateur, parce qu'un client nu se fait parfois servir autre chose.
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36")

INERTE = ('<span class="btn btn--ghost btn--lg is-soon" aria-disabled="true">'
          'App Store — bientôt</span>')

ACTIF = ('<a class="btn btn--ghost btn--lg" '
         f'href="https://apps.apple.com/fr/app/izenride/id{APP_ID}"\n'
         '         target="_blank" rel="noopener">Télécharger sur l\'App Store</a>')


def version_en_ligne() -> str | None:
    """Ce que l'App Store sert AUJOURD'HUI, pas ce qu'on espere."""
    url = f"https://itunes.apple.com/lookup?id={APP_ID}&country=fr"
    r = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(r, timeout=30) as rep:
            d = json.loads(rep.read())
    except Exception as e:
        print(f"🔴 fiche injoignable ({type(e).__name__}) — on ne conclut RIEN.")
        return None
    if not d.get("results"):
        print("🔴 la recherche ne rend aucun resultat — on ne conclut RIEN.")
        return None
    return d["results"][0].get("version")


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("--controler", action="store_true",
                   help="verifie la version en ligne sans rien modifier")
    a = p.parse_args()

    v = version_en_ligne()
    if v is None:
        return 1
    print(f"App Store sert actuellement : {v}")
    print(f"attendu pour activer        : {VERSION_ATTENDUE}")

    if v != VERSION_ATTENDUE:
        print(f"\n🚨 NE PAS ACTIVER. La fiche sert encore la {v}.")
        print("   Y envoyer un visiteur lui ferait installer l'ancienne")
        print("   application Flutter, avec ses etoiles heritees.")
        print("   Rien n'a ete modifie.")
        return 1

    texte = INDEX.read_text(encoding="utf-8")

    # 🔴 ON CHERCHE HORS DES COMMENTAIRES, ET C'EST TOUT LE SUJET.
    #
    # Premiere version de ce script, le 2026-08-27 : elle testait
    # `if ACTIF.split("\n")[0] in texte` sur le fichier BRUT. Or le bloc
    # `<!-- LIEN APP STORE VOLONTAIREMENT INACTIF … -->` CONTIENT le lien
    # d'exemple, mot pour mot — c'est meme sa raison d'etre. Le script trouvait
    # donc sa cible dans sa propre documentation, annoncait « deja actif », et
    # ne modifiait RIEN. Un succes qui ne fait rien : le pire des verts.
    #
    # C'est un defaut que ce projet a deja paye ailleurs, sous ce nom exact.
    # Le retrait des commentaires n'est pas une precaution de style : sans lui,
    # ce fichier-ci se ment a lui-meme.
    sans_commentaires = re.sub(r"<!--.*?-->", "", texte, flags=re.S)

    if "apps.apple.com" in sans_commentaires:
        print("\n✅ Le lien est DEJA actif — rien a faire.")
        return 0

    if INERTE not in sans_commentaires:
        print(f"\n🔴 Le bloc inerte attendu est introuvable dans {INDEX.name}.")
        print("   Il a peut-etre ete reecrit a la main. Ne rien modifier a")
        print("   l'aveugle : ouvrir le fichier et regarder.")
        return 2

    texte = texte.replace(INERTE, ACTIF, 1)

    # On retire aussi le commentaire d'attente : le laisser ferait croire, au
    # prochain lecteur, que le lien est encore inactif.
    texte = re.sub(r"\n\s*<!-- 🔴 LIEN APP STORE VOLONTAIREMENT INACTIF.*?-->\n",
                   "\n", texte, count=1, flags=re.S)

    INDEX.write_text(texte, encoding="utf-8")
    print(f"\n✅ Lien active dans {INDEX.name}, et le commentaire d'attente retire.")
    print("\n   Il reste a deployer — ce script ne le fait pas :")
    print("       npx vercel --prod        (depuis ce dossier, SANS --token)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
