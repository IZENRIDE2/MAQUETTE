# Fabrique une version autonome du site : CSS, JS et captures intégrés dans
# un seul .html, ouvrable d'un double-clic sans serveur (pratique à envoyer).
#
# Usage : powershell -ExecutionPolicy Bypass -File build-standalone.ps1
#
# Chaque capture apparaît 3 fois dans la page (châssis, vignette, mur). On ne
# stocke donc le base64 qu'une seule fois, dans une table JS, et un petit
# script le pose sur les <img data-img="..."> — avant que app.js ne duplique
# le mur, sinon les clones partiraient sans source.
#
# Produit trois fichiers, car le site a des pages légales : la version
# autonome des CGU/CGV part à côté, sinon les liens du pied de page
# tomberaient dans le vide. Les liens internes sont réécrits en
# conséquence.
param([string]$Out = "$PSScriptRoot\..\izenride-immersif.html")

$src  = $PSScriptRoot
$dir  = Split-Path $Out -Parent
$utf8 = New-Object System.Text.UTF8Encoding($false)
$html = [IO.File]::ReadAllText("$src\index.html", $utf8)

# Réécriture des liens entre les trois fichiers autonomes
function Relink([string]$t) {
  $t = $t.Replace('"index.html', '"izenride-immersif.html')
  $t = $t.Replace('"cgu.html',   '"izenride-cgu.html')
  $t = $t.Replace('"cgv.html',   '"izenride-cgv.html')
  return $t
}

# 1. CSS
$css = [IO.File]::ReadAllText("$src\assets\css\main.css", $utf8)
$html = $html.Replace('<link rel="stylesheet" href="assets/css/main.css">',
                      "<style>`n$css`n</style>")

# 2. Captures : src -> data-img, et table base64 unique
$entries = @()
foreach ($img in (Get-ChildItem "$src\assets\screens" -Filter *.jpg | Sort-Object Name)) {
  $b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($img.FullName))
  $entries += '"' + $img.BaseName + '":"data:image/jpeg;base64,' + $b64 + '"'
  $html = $html.Replace('src="assets/screens/' + $img.Name + '"',
                        'data-img="' + $img.BaseName + '"')
}
$table = "<script>`n(function(){var IMG={" + ($entries -join ",") + "};" +
         "Array.prototype.forEach.call(document.querySelectorAll('[data-img]')," +
         "function(el){var s=IMG[el.getAttribute('data-img')];if(s)el.src=s;});})();`n</script>"

# 3. JS, dans l'ordre de chargement. La table passe avant road-gl : tout le
#    corps est parsé à ce moment, et app.js s'exécute après.
$first = $true
foreach ($j in @('road-gl', 'scenes', 'app')) {
  $code  = [IO.File]::ReadAllText("$src\assets\js\$j.js", $utf8)
  $block = "<script>`n$code`n</script>"
  if ($first) { $block = $table + "`n" + $block; $first = $false }
  $html = $html.Replace("<script src=""assets/js/$j.js""></script>", $block)
}

# 4. Contrôles : aucune ressource ne doit rester externe
$restes = [regex]::Matches($html, '(?:src|href)="(assets/[^"]+)"') |
          ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
if ($restes) { Write-Warning "références externes restantes :"; $restes; exit 1 }

$refs = ([regex]::Matches($html, 'data-img=')).Count
"controle : $refs images referencees, $($entries.Count) encodees, 0 reference externe"

[IO.File]::WriteAllText($Out, (Relink $html), $utf8)
"ecrit : $Out  (" + [math]::Round((Get-Item $Out).Length / 1kb) + " ko)"

# 5. Pages legales : elles ne dependent que des deux feuilles de style.
$legalCss = $css + "`n" + [IO.File]::ReadAllText("$src\assets\css\legal.css", $utf8)
foreach ($p in @(@{ f = 'cgu'; t = 'CGU' }, @{ f = 'cgv'; t = 'CGV' })) {
  $doc = [IO.File]::ReadAllText("$src\$($p.f).html", $utf8)
  $doc = $doc.Replace('<link rel="stylesheet" href="assets/css/main.css">' + "`n" +
                      '<link rel="stylesheet" href="assets/css/legal.css">',
                      "<style>`n$legalCss`n</style>")
  if ($doc -match 'assets/css') { Write-Warning "$($p.t) : feuille de style non integree"; exit 1 }
  $dst = Join-Path $dir "izenride-$($p.f).html"
  [IO.File]::WriteAllText($dst, (Relink $doc), $utf8)
  "ecrit : $dst  (" + [math]::Round((Get-Item $dst).Length / 1kb) + " ko)"
}
