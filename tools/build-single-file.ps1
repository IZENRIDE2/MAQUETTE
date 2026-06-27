# Builds dist/IZENRIDE-site.html : a single self-contained HTML file.
# - css/styles.css and js/main.js are inlined
# - every app screen (screens/*.html) becomes an iframe srcdoc
# - logo images become base64 data URIs
# ASCII only (PowerShell 5.1 reads non-BOM files as ANSI).

$root = Split-Path $PSScriptRoot -Parent
$utf8 = New-Object System.Text.UTF8Encoding($false)

function Read-Utf8([string]$p) { return [IO.File]::ReadAllText($p, $utf8) }

$html = Read-Utf8 (Join-Path $root "index.html")
$css  = Read-Utf8 (Join-Path $root "css\styles.css")
$js   = Read-Utf8 (Join-Path $root "js\main.js")

# --- base64 data URIs for the logo files ---
$logoB64  = [Convert]::ToBase64String([IO.File]::ReadAllBytes((Join-Path $root "assets\logo.png")))
$badgeB64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes((Join-Path $root "assets\badge.png")))
$logoUri  = "data:image/png;base64,$logoB64"
$badgeUri = "data:image/png;base64,$badgeB64"

# --- inline CSS ---
$html = $html.Replace('<link rel="stylesheet" href="css/styles.css">', "<style>`n$css`n</style>")

# --- inline screens as srcdoc ---
Get-ChildItem (Join-Path $root "screens\*.html") | ForEach-Object {
  $name = $_.Name
  $content = Read-Utf8 $_.FullName
  # the splash references the logo with a relative path -> inline it
  $content = $content.Replace('../assets/logo.png', $logoUri)
  # escape for use inside a double-quoted attribute
  $esc = $content.Replace('&','&amp;').Replace('"','&quot;')
  # replace data-src first (it contains 'src=' as a substring)
  $html = $html.Replace('data-src="screens/' + $name + '"', 'srcdoc="' + $esc + '"')
  $html = $html.Replace('src="screens/' + $name + '"', 'srcdoc="' + $esc + '"')
}

# --- logo images and favicon ---
$html = $html.Replace('href="assets/badge.png"', 'href="' + $badgeUri + '"')
$html = $html.Replace('src="assets/badge.png"',  'src="' + $badgeUri + '"')
$html = $html.Replace('src="assets/logo.png"',   'src="' + $logoUri + '"')

# --- scripts : drop defer on CDN libs (kept external), inline main.js after them ---
$html = $html.Replace('/gsap.min.js" defer></script>', '/gsap.min.js"></script>')
$html = $html.Replace('/ScrollTrigger.min.js" defer></script>', '/ScrollTrigger.min.js"></script>')
$html = $html.Replace('/lenis.min.js" defer></script>', '/lenis.min.js"></script>')
$html = $html.Replace('<script src="js/main.js" defer></script>', "<script>`n$js`n</script>")

# --- write output ---
$distDir = Join-Path $root "dist"
if (-not (Test-Path $distDir)) { New-Item -ItemType Directory $distDir | Out-Null }
$out = Join-Path $distDir "IZENRIDE-site.html"
[IO.File]::WriteAllText($out, $html, $utf8)
$kb = [Math]::Round((Get-Item $out).Length / 1KB)
Write-Host "OK -> $out ($kb KB)"
