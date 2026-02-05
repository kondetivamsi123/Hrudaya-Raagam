# 🚀 How to Pushing to GitHub & Deploying the Website

I have already initialized Git on your project and committed all your current files. Now, you just need to connect it to your GitHub account!

---

## **Step 1: Create a Repository on GitHub**
1. Go to [github.com/new](https://github.com/new).
2. Name your repository: `Hrudaya-Raagam`.
3. Keep it **Public**.
4. **Do NOT** check "Initialize this repository with a README, .gitignore, or license" (we already have them).
5. Click **Create repository**.

---

## **Step 2: Connect and Push Your Code**
Copy the commands from the GitHub "Quick Setup" page (or use these):

```powershell
# In your main project folder (D:\Hrudaya Raagam)
git remote add origin https://github.com/YOUR_USERNAME/Hrudaya-Raagam.git
git branch -M main
git push -u origin main
```
*(Replace `YOUR_USERNAME` with your real GitHub username!)*

---

## **Step 3: Deploy the Frontend (GitHub Pages)**

To deploy the website version for free on GitHub Pages:

### **A. Prepare your Code**
Edit `frontend/vite.config.js` to add the base path:
```javascript
// Change this line in vite.config.js:
export default defineConfig({
  plugins: [react()],
  base: '/Hrudaya-Raagam/', // Add this line (must match your repo name)
})
```

### **B. Install the Deploy Tool**
In your `frontend` folder:
```powershell
npm install gh-pages --save-dev
```

### **C. Add Scripts to package.json**
Add these two lines inside the `"scripts"` section of `frontend/package.json`:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

### **D. Deploy!**
Run this command in the `frontend` folder:
```powershell
npm run deploy
```

---

## **⚠️ Important Notes**

### **1. Backend Access**
GitHub Pages is for **Static Websites**. Your backend (FastAPI) cannot be hosted on GitHub.
- For the website to work, you should deploy the backend to **Render** or **Railway** first.
- Once you have the Backend URL, update it in `frontend/src/apiConfig.js` before you run `npm run deploy`.

### **2. API URL Example**
If you deploy your backend to Render:
```javascript
// apiConfig.js
export const API_BASE_URL = 'https://hrudaya-raagam-api.onrender.com';
```

---

## **🎉 What's Next?**
- Once you run `npm run deploy`, your website will be live at:
  `https://YOUR_USERNAME.github.io/Hrudaya-Raagam/`

Would you like me to help you set up the `package.json` and `vite.config.js` files for deployment right now?
