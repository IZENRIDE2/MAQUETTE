#!/usr/bin/env python3
"""Le site en ligne sert-il ses PAGES **et leurs RESSOURCES** ?

═══════════════════════════════════════════════════════════════
🔴 POURQUOI CET OUTIL EXISTE — UN DEFAUT QUE `curl` NE VOIT PAS.

Le 2026-08-29, `izenride.fr` a ete remis en ligne. Toutes les pages repondaient
**200**, mesurees une par une. Le site etait pourtant casse : les DIX-NEUF
fichiers d'`assets/` — feuille de style, scripts, logo, les dix captures — etaient
absents du deploiement et rendaient **404**. Le site servait du HTML nu.

La cause : `.vercelignore` est une liste BLANCHE (`*` puis des `!`), et son motif
`!assets/` + `!assets/**` — celui que git documente pour re-inclure un dossier
exclu — n'est pas honore par Vercel. Chaque niveau doit etre nomme.

⚠️ CE QUI REND CE DEFAUT DANGEREUX, c'est qu'il est INVISIBLE au controle
habituel. Un `GET /` rend 200 : le HTML est bien la. Ce sont ses ressources qui
manquent, et rien dans la reponse de la page ne le dit. Un outil qui ne teste que
les pages reste vert sur un site illisible.

D'ou la regle de cet outil : on lit le HTML servi, on en EXTRAIT les `href` et
`src`, et on teste CHACUN. On ne se fie pas a une liste ecrite a la main — elle
serait fausse le jour ou quelqu'un ajoute une image.

═══════════════════════════════════════════════════════════════
⚠️ ON VERIFIE AUSSI LE TYPE DE CONTENU, ET CE N'EST PAS DU LUXE.

Une preproduction Vercel est protegee par un mur d'authentification qui repond
**200** a tout — y compris `main.css` — avec une page HTML de ~341 Ko. Tester le
seul code de statut aurait declare le site sain alors qu'il ne servait AUCUN
fichier. Un `.css` qui arrive en `text/html` est un echec, pas un succes.

Usage :
    python verifier-site-en-ligne.py                 # https://izenride.fr
    python verifier-site-en-ligne.py --base https://…  # un autre hote

Sortie 0 = tout est servi.  1 = quelque chose manque.  2 = rien n'a pu etre teste.
"""

from __future__ import annotations

import argparse
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

BASE_PAR_DEFAUT = "https://izenride.fr"

# Un vrai navigateur : certains hotes filtrent les clients nus.
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
)

# Les pages du site. Elles sont nommees — c'est le seul endroit qui l'est — parce
# qu'une page orpheline (referencee par personne) doit quand meme etre testee :
# Apple pointe directement sur `confidentialite.html` et `support.html`.
PAGES = (
    "/",
    "/cgu.html",
    "/cgv.html",
    "/confidentialite.html",
    "/mentions-legales.html",
    "/support.html",
    "/suppression-compte.html",
    "/oss-licenses.html",
)

# Ce qu'on attend comme famille de type, par extension. Le point n'est pas la
# rigueur MIME : c'est d'attraper le cas « on m'a servi du HTML a la place ».
FAMILLES = {
    ".css": "text/css",
    ".js": ("javascript", "ecmascript"),
    ".png": "image/",
    ".jpg": "image/",
    ".jpeg": "image/",
    ".svg": "image/",
    ".webp": "image/",
    ".ico": "image",
    ".woff": "font",
    ".woff2": "font",
}


def chercher(url: str) -> tuple[int | str, int, str]:
    """Rend (statut, taille, content-type). Le statut peut etre un nom d'erreur."""
    requete = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(requete, timeout=30) as rep:
            corps = rep.read()
            return rep.status, len(corps), (rep.headers.get("content-type") or "")
    except urllib.error.HTTPError as e:
        return e.code, 0, ""
    except Exception as e:  # noqa: BLE001 — on veut nommer l'echec, pas le trier
        return type(e).__name__, 0, ""


def type_incoherent(url: str, ctype: str) -> bool:
    """Un `.css` servi en `text/html`, c'est le mur d'authentification."""
    chemin = urllib.parse.urlparse(url).path.lower()
    for ext, attendu in FAMILLES.items():
        if chemin.endswith(ext):
            attendus = attendu if isinstance(attendu, tuple) else (attendu,)
            return not any(a in ctype.lower() for a in attendus)
    return False


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("--base", default=BASE_PAR_DEFAUT, help="hote a tester")
    a = p.parse_args()
    base = a.base.rstrip("/")

    print(f"Hote teste : {base}")
    print()

    echecs: list[tuple[str, str]] = []
    ressources: set[str] = set()
    pages_lues = 0

    print("── Les pages ──")
    for chemin in PAGES:
        url = base + chemin
        st, taille, _ = chercher(url)
        ok = st == 200
        print(f"  {'✅' if ok else '🔴'} {chemin:<28} {st}  {taille} o")
        if not ok:
            echecs.append((chemin, f"page : {st}"))
            continue
        pages_lues += 1
        # On relit le corps pour en extraire les references.
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=30) as rep:
                html = rep.read().decode("utf-8", "replace")
        except Exception:  # noqa: BLE001
            continue
        for m in re.finditer(r'(?:href|src)="([^"]+)"', html):
            brut = m.group(1)
            if brut.startswith(("#", "mailto:", "tel:", "data:", "http://", "https://")):
                continue
            ressources.add(urllib.parse.urljoin(url, brut))

    if pages_lues == 0:
        print("\n🔴 AUCUNE page n'a pu etre lue — on ne conclut RIEN.")
        return 2

    # ═══════════════════════════════════════════════════════════════
    # 🔴 UNE RESSOURCE `assets/` SANS VERSION EST UNE BOMBE A RETARDEMENT.
    #
    # `vercel.json` marque `/assets/(.*)` en
    # `public, max-age=31536000, immutable`. Mesure du 2026-08-29 : cet en-tete
    # est servi AUSSI SUR LES 404. Chaque navigateur qui a charge le site pendant
    # que les fichiers manquaient a donc mis « ce fichier n'existe pas » en cache
    # **pour un an**, par URL. Reparer le deploiement ne les atteint pas : ils ne
    # redemandent rien.
    #
    # Le seul levier est la CLE DE CACHE. Une ressource portant `?v=…` se
    # deverrouille en changeant la version ; une ressource nue reste empoisonnee
    # jusqu'a expiration. Les images du site etaient nues — c'est ce qui a rendu
    # l'incident durable au lieu d'etre corrige d'un deploiement.
    #
    # Cette verification n'a donc rien de cosmetique : elle interdit de
    # reintroduire la seule condition qui transforme une panne de dix minutes en
    # panne d'un an.
    nues = sorted(u for u in ressources if "/assets/" in u and "?v=" not in u)
    if nues:
        print()
        print(f"── {len(nues)} ressource(s) `assets/` SANS version ──")
        for u in nues:
            court = u[len(base):] if u.startswith(base) else u
            print(f"  🔴 {court}")
            echecs.append((court, "sans ?v= — un 404 serait cache un an (immutable)"))

    print()
    print(f"── Les ressources referencees par ces pages ({len(ressources)}) ──")
    # 🔴 C'EST LA RAISON D'ETRE DE L'OUTIL. Les pages peuvent toutes rendre 200
    # pendant que leurs feuilles de style et leurs images manquent.
    for url in sorted(ressources):
        st, taille, ctype = chercher(url)
        court = url[len(base) :] if url.startswith(base) else url
        if st != 200:
            print(f"  🔴 {court:<44} {st}")
            echecs.append((court, f"ressource : {st}"))
        elif type_incoherent(url, ctype):
            print(f"  🔴 {court:<44} 200 mais servi en « {ctype} »")
            echecs.append((court, f"type incoherent : {ctype}"))
        else:
            print(f"  ✅ {court:<44} 200  {taille} o  {ctype.split(';')[0]}")

    print()
    if echecs:
        print(f"🚨 {len(echecs)} echec(s) — LE SITE N'EST PAS SERVI CORRECTEMENT :")
        for quoi, pourquoi in echecs:
            print(f"     {quoi}  ->  {pourquoi}")
        print()
        print("   Si ce sont des ressources sous `assets/`, regarder `.vercelignore`")
        print("   AVANT le code : sa liste blanche doit nommer CHAQUE niveau de")
        print("   dossier. `!assets/**` seul ne suffit pas chez Vercel.")
        return 1

    print(f"✅ {pages_lues} page(s) et {len(ressources)} ressource(s) servies, types coherents.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
