param(
  [Parameter(Mandatory = $false)]
  [string]$StoreFile = "upload-keystore.jks",

  [Parameter(Mandatory = $false)]
  [string]$KeyAlias = "upload",

  [Parameter(Mandatory = $true)]
  [string]$StorePassword,

  [Parameter(Mandatory = $true)]
  [string]$KeyPassword,

  [Parameter(Mandatory = $false)]
  [string]$OutputPath = "android/key.properties"
)

$ErrorActionPreference = "Stop"

$content = @(
  "storeFile=$StoreFile"
  "storePassword=$StorePassword"
  "keyAlias=$KeyAlias"
  "keyPassword=$KeyPassword"
)

$targetPath = Join-Path (Get-Location) $OutputPath
$targetDir = Split-Path $targetPath -Parent
if (-not (Test-Path $targetDir)) {
  New-Item -ItemType Directory -Path $targetDir | Out-Null
}

Set-Content -Path $targetPath -Value $content -Encoding ascii
Write-Host "Created key properties: $targetPath"
