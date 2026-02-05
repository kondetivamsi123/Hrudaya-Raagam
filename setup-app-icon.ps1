# Hrudaya Raagam Icon Setup
Write-Host "Setting up app icons..." -ForegroundColor Cyan

$downloads = "$env:USERPROFILE\Downloads"
$dst = "d:\Hrudaya Raagam\frontend\android\app\src\main\res"

# Find the folder
$potentialSrc = Get-ChildItem -Path $downloads -Directory | Where-Object { $_.Name -like "android-icons*" -or $_.Name -like "IconKitchen-Output*" } | Select-Object -First 1

if ($null -eq $potentialSrc) {
    Write-Host "No icon folder found in Downloads."
    exit
}

$srcRes = Join-Path $potentialSrc.FullName "res"
if (-not (Test-Path $srcRes)) {
    $altPath = Join-Path $potentialSrc.FullName "android\res"
    if (Test-Path $altPath) { $srcRes = $altPath } else { $srcRes = $potentialSrc.FullName }
}

Write-Host "Source: $($srcRes)"

# Copy files
$count = 0
Get-ChildItem -Path $srcRes -Directory -Filter "mipmap-*" | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $dst -Recurse -Force
    Write-Host "Copied: $($_.Name)"
    $count++
}

if ($count -gt 0) {
    Write-Host "Successfully copied $count folders."
    Write-Host "Syncing Capacitor..."
    Set-Location "d:\Hrudaya Raagam\frontend"
    npx cap sync
    Write-Host "All set!"
} else {
    Write-Host "No mipmap folders found."
}
