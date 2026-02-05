# App Icon Setup - Complete Guide

## 📱 Add App Icon to Mobile App

### Step 1: Download Icon
```
1. Open in browser: d:/Hrudaya Raagam/app-icon-generator.html
2. Click: "Download Icon (PNG)" button
3. Save as: hrudaya-raagam-icon.png
4. Remember the download location (usually Downloads folder)
```

### Step 2: Generate Android Icons
```
1. Go to: https://icon.kitchen/
2. Click: "Upload Image" or drag and drop
3. Upload: hrudaya-raagam-icon.png
4. Platform: Select "Android"
5. Click: "Download"
6. Save: android-icons.zip
```

### Step 3: Extract Icon Pack
```
1. Locate: android-icons.zip in Downloads
2. Right-click → Extract All
3. Extract to: Downloads/android-icons/
4. You should see folders: mipmap-mdpi, mipmap-hdpi, etc.
```

### Step 4: Copy Icons to Project

#### Option A: Manual Copy (Windows Explorer)
```
1. Open: Downloads/android-icons/res/
2. Copy all "mipmap-*" folders
3. Navigate to: d:/Hrudaya Raagam/frontend/android/app/src/main/res/
4. Paste and replace existing folders
5. Confirm: Replace all files
```

#### Option B: PowerShell Script (Automated)
```powershell
# Run this in PowerShell

# Set paths (update Downloads path if different)
$iconSource = "$env:USERPROFILE\Downloads\android-icons\res"
$iconDest = "d:\Hrudaya Raagam\frontend\android\app\src\main\res"

# Check if source exists
if (Test-Path $iconSource) {
    Write-Host "✅ Found icon pack at: $iconSource"
    
    # Copy all mipmap folders
    Copy-Item -Path "$iconSource\mipmap-*" -Destination $iconDest -Recurse -Force
    
    Write-Host "✅ Icons copied successfully!"
    Write-Host "📱 Icon folders updated:"
    Get-ChildItem "$iconDest\mipmap-*" | ForEach-Object { Write-Host "   - $($_.Name)" }
} else {
    Write-Host "❌ Icon pack not found at: $iconSource"
    Write-Host "Please extract android-icons.zip to Downloads folder first"
}

# Sync with Capacitor
cd "d:\Hrudaya Raagam\frontend"
npx cap sync

Write-Host "`n✅ Done! Icon is now in your mobile app."
```

### Step 5: Verify Icons
```
Check these folders exist in:
d:/Hrudaya Raagam/frontend/android/app/src/main/res/

Required folders:
- mipmap-mdpi/
- mipmap-hdpi/
- mipmap-xhdpi/
- mipmap-xxhdpi/
- mipmap-xxxhdpi/

Each should contain:
- ic_launcher.png (app icon)
- ic_launcher_round.png (round icon)
- ic_launcher_foreground.png
- ic_launcher_background.png
```

### Step 6: Sync and Rebuild
```powershell
cd "d:\Hrudaya Raagam\frontend"

# If you get a "running scripts disabled" error, use:
powershell -ExecutionPolicy Bypass -File .\setup-app-icon.ps1

# Sync Capacitor
npx cap sync

# Open Android Studio
npx cap open android

# In Android Studio:
# 1. Build → Clean Project
# 2. Build → Rebuild Project
# 3. Run app to see new icon!
```

---

## 🎨 Alternative: Manual Icon Creation

If Icon Kitchen doesn't work, use these online tools:

### Option 1: Android Asset Studio
```
1. Go to: https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
2. Upload: hrudaya-raagam-icon.png
3. Adjust: Padding, shape, etc.
4. Download: ZIP file
5. Extract to: android/app/src/main/res/
```

### Option 2: App Icon Generator
```
1. Go to: https://appicon.co/
2. Upload: hrudaya-raagam-icon.png
3. Select: Android
4. Download: Icon pack
5. Extract to: android/app/src/main/res/
```

### Option 3: Resize Images Manually
```
Use: https://www.iloveimg.com/resize-image

Required sizes:
- mipmap-mdpi: 48x48px
- mipmap-hdpi: 72x72px
- mipmap-xhdpi: 96x96px
- mipmap-xxhdpi: 144x144px
- mipmap-xxxhdpi: 192x192px

Save each as: ic_launcher.png in respective folder
```

---

## 📂 Folder Structure

After copying icons, your structure should look like:

```
d:/Hrudaya Raagam/frontend/android/app/src/main/res/
├── mipmap-mdpi/
│   ├── ic_launcher.png (48x48)
│   ├── ic_launcher_round.png
│   ├── ic_launcher_foreground.png
│   └── ic_launcher_background.png
├── mipmap-hdpi/
│   ├── ic_launcher.png (72x72)
│   ├── ic_launcher_round.png
│   ├── ic_launcher_foreground.png
│   └── ic_launcher_background.png
├── mipmap-xhdpi/
│   ├── ic_launcher.png (96x96)
│   ├── ic_launcher_round.png
│   ├── ic_launcher_foreground.png
│   └── ic_launcher_background.png
├── mipmap-xxhdpi/
│   ├── ic_launcher.png (144x144)
│   ├── ic_launcher_round.png
│   ├── ic_launcher_foreground.png
│   └── ic_launcher_background.png
└── mipmap-xxxhdpi/
    ├── ic_launcher.png (192x192)
    ├── ic_launcher_round.png
    ├── ic_launcher_foreground.png
    └── ic_launcher_background.png
```

---

## 🚀 Complete Setup Script

### All-in-One PowerShell Script:

```powershell
# ========================================
# Hrudaya Raagam - Complete Icon Setup
# ========================================

Write-Host "🎵 Hrudaya Raagam - App Icon Setup" -ForegroundColor Cyan
Write-Host "====================================`n"

# Step 1: Check if icon pack exists
$iconSource = "$env:USERPROFILE\Downloads\android-icons\res"
$iconDest = "d:\Hrudaya Raagam\frontend\android\app\src\main\res"

if (-not (Test-Path $iconSource)) {
    Write-Host "⚠️  Icon pack not found!" -ForegroundColor Yellow
    Write-Host "`nPlease complete these steps first:"
    Write-Host "1. Open: d:/Hrudaya Raagam/app-icon-generator.html"
    Write-Host "2. Download icon as PNG"
    Write-Host "3. Go to: https://icon.kitchen/"
    Write-Host "4. Upload icon and select Android"
    Write-Host "5. Download and extract to Downloads folder"
    Write-Host "6. Run this script again`n"
    
    # Open icon generator
    $iconGenPath = "d:\Hrudaya Raagam\app-icon-generator.html"
    if (Test-Path $iconGenPath) {
        Write-Host "Opening icon generator..." -ForegroundColor Green
        Start-Process $iconGenPath
    }
    
    # Open Icon Kitchen
    Write-Host "Opening Icon Kitchen..." -ForegroundColor Green
    Start-Process "https://icon.kitchen/"
    
    exit
}

# Step 2: Copy icons
Write-Host "✅ Found icon pack!" -ForegroundColor Green
Write-Host "Copying icons to project...`n"

try {
    # Copy all mipmap folders
    Get-ChildItem "$iconSource\mipmap-*" | ForEach-Object {
        Copy-Item -Path $_.FullName -Destination $iconDest -Recurse -Force
        Write-Host "   ✓ Copied $($_.Name)" -ForegroundColor Green
    }
    
    Write-Host "`n✅ Icons copied successfully!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error copying icons: $_" -ForegroundColor Red
    exit
}

# Step 3: Verify icons
Write-Host "`nVerifying icon files..."
$requiredFolders = @("mipmap-mdpi", "mipmap-hdpi", "mipmap-xhdpi", "mipmap-xxhdpi", "mipmap-xxxhdpi")
$allGood = $true

foreach ($folder in $requiredFolders) {
    $folderPath = Join-Path $iconDest $folder
    if (Test-Path "$folderPath\ic_launcher.png") {
        Write-Host "   ✓ $folder" -ForegroundColor Green
    } else {
        Write-Host "   ✗ $folder - Missing ic_launcher.png" -ForegroundColor Red
        $allGood = $false
    }
}

if (-not $allGood) {
    Write-Host "`n⚠️  Some icons are missing. Please check the icon pack." -ForegroundColor Yellow
    exit
}

# Step 4: Sync Capacitor
Write-Host "`n📱 Syncing with Capacitor..."
cd "d:\Hrudaya Raagam\frontend"

try {
    npx cap sync
    Write-Host "✅ Capacitor sync complete!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Capacitor sync failed. Run 'npx cap sync' manually." -ForegroundColor Yellow
}

# Step 5: Summary
Write-Host "`n====================================`n" -ForegroundColor Cyan
Write-Host "✅ App Icon Setup Complete!" -ForegroundColor Green
Write-Host "`nNext steps:"
Write-Host "1. Open Android Studio: npx cap open android"
Write-Host "2. Build → Clean Project"
Write-Host "3. Build → Rebuild Project"
Write-Host "4. Run app to see your new icon!`n"

# Ask if user wants to open Android Studio
$response = Read-Host "Open Android Studio now? (Y/N)"
if ($response -eq "Y" -or $response -eq "y") {
    Write-Host "Opening Android Studio..." -ForegroundColor Green
    npx cap open android
}

Write-Host "`n🎉 Done! Your app now has a beautiful icon!" -ForegroundColor Cyan
```

---

## 🎯 Quick Checklist

### Before Running Script:
- [ ] Downloaded icon from app-icon-generator.html
- [ ] Uploaded to https://icon.kitchen/
- [ ] Selected "Android" platform
- [ ] Downloaded android-icons.zip
- [ ] Extracted to Downloads folder

### Run Setup:
- [ ] Open PowerShell
- [ ] Copy script above
- [ ] Paste and run
- [ ] Wait for completion

### Verify:
- [ ] All mipmap folders exist
- [ ] Each has ic_launcher.png
- [ ] Capacitor sync successful
- [ ] Android Studio opens

### Test:
- [ ] Clean and rebuild in Android Studio
- [ ] Run app on emulator/phone
- [ ] See new icon on home screen
- [ ] Icon looks good!

---

## 🔧 Troubleshooting

### "Icon pack not found"
```
1. Make sure you extracted android-icons.zip
2. Check it's in: C:\Users\YourName\Downloads\android-icons\
3. Verify it has a "res" folder inside
4. Update $iconSource path in script if different location
```

### "Icons not showing in app"
```
1. In Android Studio: Build → Clean Project
2. Build → Rebuild Project
3. Uninstall old app from phone
4. Install fresh
5. Icon should appear
```

### "Capacitor sync failed"
```
1. Make sure you're in frontend folder
2. Run manually: npx cap sync
3. Check for errors
4. Fix any issues and retry
```

### "Wrong icon showing"
```
1. Check ic_launcher.png in all mipmap folders
2. Make sure they're not the default Android icon
3. Clean and rebuild
4. Reinstall app
```

---

## 📱 Final Result

After completing these steps, your app will have:
- ✅ Beautiful custom icon (music + heart)
- ✅ Proper sizes for all screen densities
- ✅ Round icon variant
- ✅ Adaptive icon (Android 8+)
- ✅ Professional appearance

**Your app is ready to impress!** 🎉

---

## 💾 Save This Script

Save the PowerShell script above as:
`d:/Hrudaya Raagam/setup-app-icon.ps1`

Then run:
```powershell
cd "d:\Hrudaya Raagam"
.\setup-app-icon.ps1
```

**Icon setup made easy!** 🎨📱
