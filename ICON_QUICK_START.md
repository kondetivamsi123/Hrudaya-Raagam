# 🚀 QUICK START - App Icon Setup

## 📋 Simple 6-Step Process

### Step 1: Download Icon
```
Open: d:/Hrudaya Raagam/app-icon-generator.html
Click: "Download Icon (PNG)"
Save: hrudaya-raagam-icon.png
```

### Step 2: Go to Icon Kitchen
```
URL: https://icon.kitchen/
```

### Step 3: Upload Icon
```
Click: "Upload Image"
Select: hrudaya-raagam-icon.png
```

### Step 4: Select Android
```
Platform: Android
Click: "Download"
Save: android-icons.zip
```

### Error: "running scripts is disabled on this system"
Run the script using the Bypass flag:
```powershell
powershell -ExecutionPolicy Bypass -File .\setup-app-icon.ps1
```
Or enable scripts for your user:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Step 5: Extract Icon Pack
```
Location: Downloads folder
Right-click: android-icons.zip
Select: "Extract All"
Extract to: Downloads/android-icons/
```

### Step 6: Run Setup Script
```powershell
# Open PowerShell
cd "d:\Hrudaya Raagam"

# If you see a "running scripts is disabled" error, use this command:
powershell -ExecutionPolicy Bypass -File .\setup-app-icon.ps1
```

**That's it! Icon is now in your app!** ✅

---

## 🎯 Alternative: Manual Copy

If script doesn't work:

```
1. Open: Downloads/android-icons/res/
2. Copy: All "mipmap-*" folders
3. Go to: d:/Hrudaya Raagam/frontend/android/app/src/main/res/
4. Paste: Replace existing folders
5. Run: npx cap sync
```

---

## ✅ Verify Icon

Check these folders exist:
```
d:/Hrudaya Raagam/frontend/android/app/src/main/res/
├── mipmap-mdpi/ic_launcher.png
├── mipmap-hdpi/ic_launcher.png
├── mipmap-xhdpi/ic_launcher.png
├── mipmap-xxhdpi/ic_launcher.png
└── mipmap-xxxhdpi/ic_launcher.png
```

---

## 🎉 Done!

Your app now has a beautiful icon combining:
- 🎵 Music note
- ❤️ Heart symbol
- 🌈 Beautiful gradient

**See full guide: ICON_SETUP_GUIDE.md**
