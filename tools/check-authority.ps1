# check-authority.ps1 — 校验 authority/ 权威文件是否与 MANIFEST 记录一致
# 用法: powershell -ExecutionPolicy Bypass -File tools/check-authority.ps1
# 退出码: 0 = 全部一致; 1 = 有偏移（先查明谁改的、是否记了 decision_log，再继续工作）

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$manifest = Get-Content (Join-Path $root 'authority\MANIFEST.md') -Raw -Encoding UTF8

# 文本文件（md/html）用换行无关哈希：解码文本、剥 CR、按 UTF-8 无 BOM 重编码后取 MD5。
# 这样不同机器 autocrlf 设置不同也不会误报漂移。二进制（xlsx 等）仍按原始字节。
function Get-AuthorityMd5([string]$path) {
    if ($path -match '\.(md|html)$') {
        $text = [IO.File]::ReadAllText($path).Replace("`r", "")
        $bytes = [Text.UTF8Encoding]::new($false).GetBytes($text)
        $md5 = [Security.Cryptography.MD5]::Create()
        return ([BitConverter]::ToString($md5.ComputeHash($bytes)).Replace('-', ''))
    }
    return (Get-FileHash $path -Algorithm MD5).Hash
}

# 从 MANIFEST 表格解析 "文件路径 | MD5" 对（反引号包裹的相对路径 + 32 位哈希）
$pattern = '\|\s*`([^`]+\.(?:md|html|xlsx))`\s*\|\s*`([0-9A-F]{32})`'
$entries = [regex]::Matches($manifest, $pattern)

if ($entries.Count -eq 0) { Write-Host "ERROR: MANIFEST 中未解析到任何条目"; exit 1 }

$fail = 0
foreach ($m in $entries) {
    $rel = $m.Groups[1].Value
    $expected = $m.Groups[2].Value
    $full = Join-Path (Join-Path $root 'authority') $rel
    if (-not (Test-Path $full)) {
        Write-Host ("MISSING  {0}" -f $rel); $fail++; continue
    }
    $actual = Get-AuthorityMd5 $full
    if ($actual -ne $expected) {
        Write-Host ("DRIFT    {0}" -f $rel)
        Write-Host ("         manifest: {0}" -f $expected)
        Write-Host ("         actual:   {0}" -f $actual)
        $fail++
    } else {
        Write-Host ("OK       {0}" -f $rel)
    }
}

# KV 资产包：只查目录存在与文件数（体积大，不逐一哈希）
$kv = @(
    @{ Path = 'design\authority\icon_start_tt\start'; Expect = 9; Name = 'Start V23 package' },
    @{ Path = 'design\authority\icon_start_tt\icon\android_launcher_rework_v4_safezone'; Expect = 20; Name = 'Icon V4 safezone package' }
)
foreach ($p in $kv) {
    $full = Join-Path $root $p.Path
    if (-not (Test-Path $full)) { Write-Host ("MISSING  {0}" -f $p.Name); $fail++; continue }
    $n = (Get-ChildItem $full -Recurse -File).Count
    if ($n -ne $p.Expect) {
        Write-Host ("DRIFT    {0}: {1} files (manifest says {2})" -f $p.Name, $n, $p.Expect); $fail++
    } else {
        Write-Host ("OK       {0} ({1} files)" -f $p.Name, $n)
    }
}

if ($fail -gt 0) {
    Write-Host ""
    Write-Host ("AUTHORITY CHECK FAILED: {0} item(s) drifted." -f $fail)
    Write-Host "有人未走流程改动权威文件。先查 git log -- authority/ 与 decision_log，确认后按 MANIFEST 铁律第 2 条补账或回滚。"
    exit 1
}
Write-Host ""
Write-Host "AUTHORITY CHECK PASSED."
exit 0
