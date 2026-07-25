# Fabrique une version autonome du site : CSS, JS et captures intégrés dans
# un seul .html, ouvrable d'un double-clic sans serveur (pratique à envoyer).
#
# Usage : powershell -ExecutionPolicy Bypass -File build-standalone.ps1
#
# Chaque capture apparaît 3 fois dans la page (châssis, vignette, mur). On ne
# stocke donc le base64 qu'une seule fois, dans une table JS, et un petit
# script le pose sur les <img data-img="..."> — avant que app.js ne duplique
# le mur, sinon les clones partiraient sans source.
param([string]$Out = "$PSScriptRoot\..\izenride-immersif.html")

$src  = $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)
$html = [IO.File]::ReadAllText("$src\index.html", $utf8)

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

[IO.File]::WriteAllText($Out, $html, $utf8)
"ecrit : $Out  (" + [math]::Round((Get-Item $Out).Length / 1kb) + " ko)"
