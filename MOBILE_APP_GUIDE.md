# 📱 Mobile App Development Guide

## Overview
Convert your Hrudaya Raagam web app into a mobile app using **React Native** or **Capacitor**.

## Option 1: Capacitor (Recommended - Easiest)

### Why Capacitor?
- ✅ Reuse your existing React code
- ✅ Minimal changes needed
- ✅ Works on iOS and Android
- ✅ Access to native features (camera, sensors, etc.)

### Steps to Create Mobile App:

#### 1. Install Capacitor
```bash
cd "d:/Hrudaya Raagam/frontend"
npm install @capacitor/core @capacitor/cli
npx cap init
```

When prompted:
- App name: `Hrudaya Raagam`
- Package ID: `com.hrudayaragam.app`
- Web directory: `dist`

#### 2. Build Your Web App
```bash
npm run build
```

#### 3. Add Mobile Platforms
```bash
# For Android
npm install @capacitor/android
npx cap add android

# For iOS (Mac only)
npm install @capacitor/ios
npx cap add ios
```

#### 4. Copy Web Assets to Native Projects
```bash
npx cap copy
npx cap sync
```

#### 5. Open in Native IDE

**For Android:**
```bash
npx cap open android
```
- Opens in Android Studio
- Click "Run" to test on emulator or device

**For iOS (Mac only):**
```bash
npx cap open ios
```
- Opens in Xcode
- Click "Run" to test on simulator or device

### Mobile-Specific Features to Add:

#### 1. **Real Heartbeat Sensor**
```javascript
// Install plugin
npm install @capacitor-community/heart-rate

// Use in code
import { HeartRate } from '@capacitor-community/heart-rate';

const getHeartRate = async () => {
    const result = await HeartRate.getHeartRate();
    return result.value;
};
```

#### 2. **Offline Storage**
```javascript
// Install plugin
npm install @capacitor/storage

// Save songs for offline
import { Storage } from '@capacitor/storage';

await Storage.set({
    key: 'offline_songs',
    value: JSON.stringify(songs)
});
```

#### 3. **Background Audio**
```javascript
// Install plugin
npm install capacitor-plugin-background-mode

// Keep music playing in background
import { BackgroundMode } from 'capacitor-plugin-background-mode';

BackgroundMode.enable();
```

#### 4. **Push Notifications**
```javascript
// Install plugin
npm install @capacitor/push-notifications

// Notify when new songs added
import { PushNotifications } from '@capacitor/push-notifications';
```

### Mobile UI Adjustments Needed:

#### 1. **Responsive Design**
Update `index.css` for mobile:
```css
/* Mobile-first approach */
@media (max-width: 768px) {
    .navbar {
        flex-direction: column;
    }
    
    .music-player {
        bottom: 60px; /* Account for mobile nav */
    }
    
    .search-results {
        grid-template-columns: 1fr; /* Single column on mobile */
    }
}
```

#### 2. **Touch-Friendly Buttons**
```css
.btn {
    min-height: 44px; /* iOS minimum touch target */
    min-width: 44px;
}
```

#### 3. **Safe Areas (iPhone notch)**
```css
body {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
}
```

## Option 2: React Native (More Complex)

### Why React Native?
- ✅ Better performance
- ✅ More native feel
- ❌ Requires rewriting components
- ❌ Steeper learning curve

### Steps:

#### 1. Create New React Native Project
```bash
npx react-native init HrudayaRaagam
cd HrudayaRaagam
```

#### 2. Install Dependencies
```bash
npm install @react-navigation/native
npm install react-native-track-player  # For music playback
npm install react-native-sensors  # For heartbeat
```

#### 3. Port Your Components
Convert React components to React Native:
```javascript
// Before (Web)
<div style={{ padding: '1rem' }}>
    <button onClick={handlePlay}>Play</button>
</div>

// After (React Native)
<View style={{ padding: 16 }}>
    <TouchableOpacity onPress={handlePlay}>
        <Text>Play</Text>
    </TouchableOpacity>
</View>
```

## Recommended Approach: **Capacitor**

### Complete Capacitor Setup Script:

```bash
# Navigate to frontend
cd "d:/Hrudaya Raagam/frontend"

# Install Capacitor
npm install @capacitor/core @capacitor/cli

# Initialize
npx cap init "Hrudaya Raagam" com.hrudayaragam.app

# Build web app
npm run build

# Add Android
npm install @capacitor/android
npx cap add android

# Sync
npx cap sync

# Open in Android Studio
npx cap open android
```

## Testing on Your Phone:

### Android:
1. Enable Developer Mode on phone
2. Enable USB Debugging
3. Connect phone to computer
4. In Android Studio, select your device
5. Click "Run"

### iOS (Mac only):
1. Connect iPhone to Mac
2. In Xcode, select your device
3. Click "Run"

## App Store Deployment:

### Android (Google Play):
1. Build release APK in Android Studio
2. Sign with keystore
3. Upload to Google Play Console
4. Fill app details
5. Submit for review

### iOS (App Store):
1. Build in Xcode (Mac required)
2. Archive app
3. Upload to App Store Connect
4. Fill app details
5. Submit for review

## Mobile-Specific Features to Implement:

### 1. **Biometric Authentication**
```javascript
npm install @capacitor-community/biometric

import { BiometricAuth } from '@capacitor-community/biometric';

const authenticate = async () => {
    const result = await BiometricAuth.verify({
        reason: "Login to Hrudaya Raagam"
    });
    return result.verified;
};
```

### 2. **Share Songs**
```javascript
import { Share } from '@capacitor/share';

const shareSong = async (song) => {
    await Share.share({
        title: song.title,
        text: `Listen to ${song.title} on Hrudaya Raagam!`,
        url: song.file_url
    });
};
```

### 3. **Download Manager**
```javascript
import { Filesystem } from '@capacitor/filesystem';

const downloadSong = async (song) => {
    const response = await fetch(song.file_url);
    const blob = await response.blob();
    
    await Filesystem.writeFile({
        path: `songs/${song.title}.mp3`,
        data: blob,
        directory: Directory.Documents
    });
};
```

## Quick Start (5 Minutes):

```bash
# 1. Install Capacitor
cd "d:/Hrudaya Raagam/frontend"
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize
npx cap init "Hrudaya Raagam" com.hrudayaragam.app --web-dir=dist

# 3. Build
npm run build

# 4. Add Android
npx cap add android

# 5. Sync
npx cap sync

# 6. Open in Android Studio
npx cap open android

# 7. Click "Run" in Android Studio!
```

## Next Steps:

1. **Test on emulator** first
2. **Add mobile-specific features** (heartbeat sensor, offline mode)
3. **Optimize for mobile** (touch targets, safe areas)
4. **Test on real device**
5. **Build release version**
6. **Submit to app stores**

**Your web app is already 90% ready for mobile!** 🎉

Just run the Capacitor setup and you'll have a mobile app in minutes!
