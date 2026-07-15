param()

$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$workspaceRoot = Split-Path $repoRoot -Parent
$harnessTarget = Join-Path $repoRoot '00_harness'
$compatPath = Join-Path $workspaceRoot '00_harness'

if (-not (Test-Path -LiteralPath $harnessTarget)) {
    throw "Harness target not found: $harnessTarget"
}

if (Test-Path -LiteralPath $compatPath) {
    $existing = Get-Item -LiteralPath $compatPath -Force
    if ($existing.LinkType -eq 'Junction' -and $existing.Target -contains $harnessTarget) {
        Write-Host "Compatibility junction already exists: $compatPath"
        exit 0
    }

    throw "Refusing to replace existing path: $compatPath"
}

New-Item -ItemType Junction -Path $compatPath -Target $harnessTarget | Out-Null
Write-Host "Created compatibility junction: $compatPath -> $harnessTarget"
