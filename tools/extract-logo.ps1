# Extracts the exact IZENRIDE logo from the source PNG:
#  - assets/logo.png  : full lockup (badge + wordmark), transparent background
#  - assets/badge.png : circular badge only, transparent outside the circle
# ASCII only (PowerShell 5.1 reads non-BOM files as ANSI).

Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\33766\Desktop\LOGO APPLICATION NOTIFICATION.PNG"
$outDir  = Join-Path $PSScriptRoot "..\assets"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$w = $src.Width; $h = $src.Height

# --- scan bright pixels (white circle + white text) ---
$minX=$w; $maxX=0; $minY=$h; $maxY=0          # whole lockup bbox
$cMinX=$w; $cMaxX=0; $cMinY=$h; $cMaxY=0      # circle bbox (left third)
for ($y=0; $y -lt $h; $y++) {
  for ($x=0; $x -lt $w; $x++) {
    $p = $src.GetPixel($x,$y)
    if (($p.R + $p.G + $p.B) -gt 600) {
      if ($x -lt $minX){$minX=$x}; if ($x -gt $maxX){$maxX=$x}
      if ($y -lt $minY){$minY=$y}; if ($y -gt $maxY){$maxY=$y}
      if ($x -lt [int]($w*0.33)) {
        if ($x -lt $cMinX){$cMinX=$x}; if ($x -gt $cMaxX){$cMaxX=$x}
        if ($y -lt $cMinY){$cMinY=$y}; if ($y -gt $cMaxY){$cMaxY=$y}
      }
    }
  }
}
$cx = ($cMinX + $cMaxX) / 2.0
$cy = ($cMinY + $cMaxY) / 2.0
$r  = [Math]::Max($cMaxX - $cMinX, $cMaxY - $cMinY) / 2.0
Write-Host "lockup bbox: $minX..$maxX / $minY..$maxY  circle: c=($cx,$cy) r=$r"

function Get-Alpha([System.Drawing.Color]$p) {
  # background ~ #0A0A0A -> transparent; white -> opaque; ramp for antialiasing
  $b = [Math]::Max([Math]::Max($p.R,$p.G),$p.B)
  if ($b -le 30) { return 0 }
  if ($b -ge 90) { return 255 }
  return [int](($b - 30) * 255 / 60)
}

# --- 1. full lockup, transparent background ---
$pad = 8
$x0 = [Math]::Max(0, $minX - $pad); $y0 = [Math]::Max(0, $minY - $pad)
$x1 = [Math]::Min($w-1, $maxX + $pad); $y1 = [Math]::Min($h-1, $maxY + $pad)
$lw = $x1 - $x0 + 1; $lh = $y1 - $y0 + 1
$logo = New-Object System.Drawing.Bitmap($lw, $lh, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for ($y=0; $y -lt $lh; $y++) {
  for ($x=0; $x -lt $lw; $x++) {
    $p = $src.GetPixel($x0+$x, $y0+$y)
    $dx = ($x0+$x) - $cx; $dy = ($y0+$y) - $cy
    $inCircle = ([Math]::Sqrt($dx*$dx + $dy*$dy) -le ($r + 0.5))
    if ($inCircle) { $a = 255 } else { $a = Get-Alpha $p }
    $logo.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($a, $p.R, $p.G, $p.B))
  }
}
$logo.Save((Join-Path $outDir "logo.png"), [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "logo.png : $lw x $lh"

# --- 2. badge only, circular alpha mask ---
$pad2 = 3
$bx0 = [Math]::Max(0, [int]($cx - $r) - $pad2); $by0 = [Math]::Max(0, [int]($cy - $r) - $pad2)
$bs  = [int](2*$r) + 2*$pad2 + 1
$badge = New-Object System.Drawing.Bitmap($bs, $bs, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for ($y=0; $y -lt $bs; $y++) {
  for ($x=0; $x -lt $bs; $x++) {
    $sx = $bx0 + $x; $sy = $by0 + $y
    if ($sx -ge $w -or $sy -ge $h) { continue }
    $p = $src.GetPixel($sx, $sy)
    $dx = $sx - $cx; $dy = $sy - $cy
    $d = [Math]::Sqrt($dx*$dx + $dy*$dy)
    if ($d -le $r) { $a = 255 }
    elseif ($d -le ($r + 1.5)) { $a = [int]((($r + 1.5) - $d) / 1.5 * 255) }  # feathered edge
    else { $a = 0 }
    $badge.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($a, $p.R, $p.G, $p.B))
  }
}
$badge.Save((Join-Path $outDir "badge.png"), [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "badge.png : $bs x $bs"

$src.Dispose(); $logo.Dispose(); $badge.Dispose()
Write-Host "done"
