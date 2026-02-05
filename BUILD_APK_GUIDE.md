# 📦 How to Build Your Android APK

You chose **Option B**. Here is the step-by-step guide to generating your `.apk` file so you can install it on your phone!

### **Pre-requisites**
1. **Android Studio**: Installed on your PC.
2. **Phone Connection**: Use a USB cable to connect your phone to your PC.

---

## **Step 1: Open the Project in Android Studio**

Since `npx cap open android` might not find your installation path, do it manually:
1. Open **Android Studio**.
2. Click **Open** or **Import Project**.
3. Select this folder: `d:\Hrudaya Raagam\frontend\android`.
4. Wait for the "Gradle Sync" to finish (watch the progress bar at the bottom).

## **Step 2: Generate the APK**

In Android Studio:
1. Go to the top menu: **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
2. Android Studio will start building. This might take 2-5 minutes.
3. Once finished, a notification will appear at the bottom right.
4. Click **locate** in that notification.
5. Your APK will be named `app-debug.apk`. 

## **Step 3: Install on Your Phone**

### **Method A: USB (Recommended for Testing)**
1. Enable **Developer Options** and **USB Debugging** on your phone.
2. Connect your phone to your PC.
3. In Android Studio, click the **Green Play Button** (Run) at the top.
4. Your app will install and open automatically!

### **Method B: Manual APK Transfer**
1. Copy the `app-debug.apk` file to your phone (via USB/Email/Google Drive).
2. Open the file on your phone.
3. Your phone might warn you about "Unknown Apps". Click **Settings** and allow it.
4. Click **Install**.

---

## **⚠️ Important: Connection Settings**

I have already updated your code to use your computer's IP address: `10.114.117.136`.

**For the app to work on your phone:**
1. Your **Phone** and **PC** must be on the same Wi-Fi.
2. Your **Backend Server** must be running on your PC.
3. **PowerShell command to keep backend running:**
   ```powershell
   cd "d:/Hrudaya Raagam/backend"
   python main.py
   ```

---

## **🚀 Troubleshooting**

### **"The app says 'Network Error' on my phone"**
- Your computer's firewall might be blocking the connection.
- **Fix**: Open Windows Firewall settings and allow **Python** through the firewall for "Private" and "Public" networks.

### **"Gradle Build Failed"**
- Make sure you are connected to the internet (Gradle needs to download some files).
- Click **File** > **Sync Project with Gradle Files** in Android Studio.

### **"My IP changed"**
- If you move to a different Wi-Fi, your IP might change.
- Run `ipconfig` to find your new IP.
- Update it in `d:/Hrudaya Raagam/frontend/src/apiConfig.js`.
- Run: `npm run build; npx cap sync`.

---

## **🎉 You are Now a Mobile App Developer!**
Once you have the APK, you can share it with anyone! 

**Want to go further?**
- **Option A**: Upload to the web so it works anywhere.
- **Option C**: Set up a real database for users.

What would you like to do after you test the APK?
