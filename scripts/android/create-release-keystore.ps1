param(
  [Parameter(Mandatory = $false)]
  [string]$JavaHome,

  [Parameter(Mandatory = $false)]
  [string]$StoreFile = "android/upload-keystore.jks",

  [Parameter(Mandatory = $false)]
  [string]$Alias = "upload",

  [Parameter(Mandatory = $true)]
  [string]$StorePassword,

  [Parameter(Mandatory = $true)]
  [string]$KeyPassword,

  [Parameter(Mandatory = $false)]
  [string]$DName = "CN=FocusTimer, OU=Mobile, O=FocusTimer, L=Seoul, ST=Seoul, C=KR",

  [Parameter(Mandatory = $false)]
  [int]$ValidityDays = 10000
)

$ErrorActionPreference = "Stop"

if ($JavaHome) {
  $env:JAVA_HOME = $JavaHome
  $env:Path = "$JavaHome\bin;$env:Path"
}

$keytool = Get-Command keytool -ErrorAction SilentlyContinue
if (-not $keytool) {
  throw "keytool was not found. Install JDK 17+ and set JAVA_HOME before running this script."
}

$storePath = Join-Path (Get-Location) $StoreFile
$storeDir = Split-Path $storePath -Parent
if (-not (Test-Path $storeDir)) {
  New-Item -ItemType Directory -Path $storeDir | Out-Null
}

& $keytool.Source `
  -genkeypair `
  -v `
  -keystore $storePath `
  -alias $Alias `
  -keyalg RSA `
  -keysize 2048 `
  -validity $ValidityDays `
  -storepass $StorePassword `
  -keypass $KeyPassword `
  -dname $DName

Write-Host "Created keystore: $storePath"
