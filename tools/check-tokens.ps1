<#
.SYNOPSIS
  Token regression guard — fails if hardcoded colors leak back into UI code.
.DESCRIPTION
  Android: grep ui/ (excluding theme/) for Color(0x
  Web: grep web/src/ (excluding tokens.css) for raw rgba(
  Exit 1 if any non-exempt match found.
#>

$root = Split-Path $PSScriptRoot -Parent
$exitCode = 0

# ── Android ──
$androidUi = Join-Path $root "android\app\src\main\java\com\antnagi\nagisheart\ui"
$androidHits = @()
if (Test-Path $androidUi) {
    $androidHits = Get-ChildItem -Path $androidUi -Recurse -Include "*.kt" |
        Where-Object { $_.FullName -notmatch '\\theme\\' -and $_.Name -ne 'DebugOverlay.kt' } |
        Select-String -Pattern 'Color\(0x[0-9A-Fa-f]' |
        Where-Object { $_.Line -notmatch '// token-exempt' }
}

if ($androidHits.Count -gt 0) {
    Write-Host "FAIL: $($androidHits.Count) hardcoded Color(0x...) in Android ui/ (outside theme/)" -ForegroundColor Red
    $androidHits | ForEach-Object { Write-Host "  $($_.RelativePath($root)):$($_.LineNumber): $($_.Line.Trim())" }
    $exitCode = 1
} else {
    Write-Host "OK: Android ui/ clean" -ForegroundColor Green
}

# ── Web ──
$webSrc = Join-Path $root "web\src"
$webHits = @()
if (Test-Path $webSrc) {
    $webHits = Get-ChildItem -Path $webSrc -Recurse -Include "*.css","*.js","*.ts","*.jsx","*.tsx" |
        Where-Object { $_.Name -ne 'tokens.css' } |
        Select-String -Pattern 'rgba\(\s*\d' |
        Where-Object { $_.Line -notmatch '/\* token-exempt \*/' }
}

if ($webHits.Count -gt 0) {
    Write-Host "FAIL: $($webHits.Count) hardcoded rgba() in web/src/ (outside tokens.css)" -ForegroundColor Red
    $webHits | ForEach-Object { Write-Host "  $($_.RelativePath($root)):$($_.LineNumber): $($_.Line.Trim())" }
    $exitCode = 1
} else {
    Write-Host "OK: Web src/ clean" -ForegroundColor Green
}

exit $exitCode
