# Fabrique une version autonome du site : un seul .html, ouvrable d'un
# double-clic sans serveur, qui s'envoie tel quel.
#
# Usage : powershell -ExecutionPolicy Bypass -File build-standalone.ps1
#
# Deux points méritent une explication :
#
# 1. Les captures. Chacune apparaît 3 fois dans la page (châssis, vignette,
#    mur). Les encoder à chaque occurrence donnait 2,7 Mo ; le base64 n'est
#    donc stocké qu'une fois dans une table JS, qu'un court script pose sur
#    les <img data-img="...">. Ce script passe avant app.js, sinon les
#    clones du mur partiraient sans source.
#
# 2. Les pages légales. Les livrer à côté obligeait à garder trois fichiers
#    ensemble — un seul envoyé, et les liens CGU/CGV tombaient dans le vide.
#    Elles sont donc embarquées dans la page et affichées à la place du site
#    selon le fragment d'URL. Leurs identifiants sont préfixés : #beta et
#    #litiges existent des deux côtés, et des id en double casseraient la
#    navigation par ancre.
param([string]$Out = "$PSScriptRoot\..\izenride-immersif.html")

$src  = $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)
$html = [IO.File]::ReadAllText("$src\index.html", $utf8)

# ── 1. Feuilles de style ──
$css = [IO.File]::ReadAllText("$src\assets\css\main.css", $utf8) + "`n" +
       [IO.File]::ReadAllText("$src\assets\css\legal.css", $utf8)
$html = $html.Replace('<link rel="stylesheet" href="assets/css/main.css">',
                      "<style>`n$css`n</style>")

# ── 2. Captures : src -> data-img, base64 stocké une seule fois ──
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

# ── 3. Scripts, dans l'ordre de chargement ──
$first = $true
foreach ($j in @('road-gl', 'scenes', 'app')) {
  $code  = [IO.File]::ReadAllText("$src\assets\js\$j.js", $utf8)
  $block = "<script>`n$code`n</script>"
  if ($first) { $block = $table + "`n" + $block; $first = $false }
  $html = $html.Replace("<script src=""assets/js/$j.js""></script>", $block)
}

# ── 4. Documents légaux embarqués ──
function Embed([string]$file, [string]$prefix) {
  $doc = [IO.File]::ReadAllText("$src\$file.html", (New-Object System.Text.UTF8Encoding($false)))
  $m = [regex]::Match($doc, '(?s)<main class="doc-page">(.*?)</main>')
  if (-not $m.Success) { throw "corps introuvable dans $file.html" }
  $frag = $m.Groups[1].Value

  # a. mettre de côté les liens qui sortent du document
  $frag = [regex]::Replace($frag, 'href="index\.html#([\w-]+)"', 'href="@@S@@$1"')
  $frag = $frag.Replace('href="index.html"', 'href="@@S@@hero"')
  $frag = $frag.Replace('href="cgu.html"',   'href="@@CGU@@"')
  $frag = $frag.Replace('href="cgv.html"',   'href="@@CGV@@"')

  # b. préfixer les identifiants internes (#beta et #litiges sont ambigus)
  $frag = [regex]::Replace($frag, 'id="([\w-]+)"',    ('id="' + $prefix + '-$1"'))
  $frag = [regex]::Replace($frag, 'href="#([\w-]+)"', ('href="#' + $prefix + '-$1"'))

  # c. rétablir les liens externes
  $frag = [regex]::Replace($frag, 'href="@@S@@([\w-]+)"', 'href="#$1"')
  $frag = $frag.Replace('href="@@CGU@@"', 'href="#cgu"')
  $frag = $frag.Replace('href="@@CGV@@"', 'href="#cgv"')

  # `doc-page` porte le retrait qui dégage la barre de nav fixe : on extrait
  # le contenu de <main>, il faut donc reposer la classe sur le conteneur.
  return "<div class=""doc-embed doc-page"" id=""$prefix"">$frag</div>"
}

$router = @'
<script>
// Affiche un document légal à la place du site quand le fragment le vise
// (#cgu, #cgv, ou une ancre interne comme #cgu-preambule).
(function () {
  var docs = Array.prototype.slice.call(document.querySelectorAll('.doc-embed'));
  function route() {
    var h = location.hash.replace('#', ''), open = null;
    docs.forEach(function (d) {
      var on = (h === d.id) || h.indexOf(d.id + '-') === 0;
      d.style.display = on ? 'block' : 'none';
      if (on) open = d;
    });
    document.body.classList.toggle('is-doc', !!open);
    if (open && h === open.id) window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  route();
})();
</script>
'@

$embeds = (Embed 'cgu' 'cgu') + "`n" + (Embed 'cgv' 'cgv')
$html = $html.Replace('</body>', $embeds + "`n" + $router + "`n</body>")
$html = $html.Replace('href="cgu.html"', 'href="#cgu"')
$html = $html.Replace('href="cgv.html"', 'href="#cgv"')

# ── 5. Contrôles ──
$restes = [regex]::Matches($html, '(?:src|href)="(assets/[^"]+|[\w-]+\.html[^"]*)"') |
          ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
if ($restes) { Write-Warning "ressources non integrees :"; $restes; exit 1 }

$ids = [regex]::Matches($html, 'id="([\w-]+)"') | ForEach-Object { $_.Groups[1].Value }
$dbl = $ids | Group-Object | Where-Object { $_.Count -gt 1 }
if ($dbl) { Write-Warning "identifiants en double :"; $dbl.Name; exit 1 }

$morts = [regex]::Matches($html, 'href="#([\w-]+)"') |
         ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique |
         Where-Object { $ids -notcontains $_ }
if ($morts) { Write-Warning "ancres mortes :"; $morts; exit 1 }

"controle : {0} images ({1} encodees), {2} id uniques, 0 ancre morte, 0 ressource externe" -f `
  ([regex]::Matches($html, 'data-img=')).Count, $entries.Count, $ids.Count

[IO.File]::WriteAllText($Out, $html, $utf8)
"ecrit : $Out  (" + [math]::Round((Get-Item $Out).Length / 1kb) + " ko)"
