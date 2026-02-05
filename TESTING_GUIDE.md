# Hrudaya Raagam - Testing Guide

## ✅ What's Been Fixed

### 1. **Play Button Implementation**
- ✅ Global music player now works across all pages
- ✅ Play buttons added to Search results and Home recommendations
- ✅ Player persists while navigating between pages

### 2. **Streaming Bridge Implementation**
- ✅ All songs now use **external MP3 URLs** from SoundHelix (free test audio)
- ✅ `/admin/import` endpoint created for adding new songs with URLs
- ✅ Backend automatically redirects to external URLs when playing songs

### 3. **Mood Fix**
- ✅ "Sad" renamed to "Melody" for relaxing songs (60-75 BPM)
- ✅ Database updated with correct mood tags

## 🧪 How to Test

### Step 1: Open the Application
1. Open your browser and go to: **http://localhost:5173**
2. You should see the login page

### Step 2: Login
- Username: `vamsi`
- Password: `Vamsi@123`

### Step 3: Test Search & Play
1. Click in the search bar at the top
2. Type "Butta" or "Samaja"
3. Press Enter
4. You'll see search results with **Play** and **Download** buttons
5. Click the **Play** button on any song
6. **Expected Result**: A music player should appear at the bottom with:
   - Song title and artist
   - Play/pause button (white circle)
   - Progress bar
   - Lyrics button (microphone icon)
   - The song should start playing automatically

### Step 4: Test Global Player
1. While music is playing, navigate to different pages (Home, Profile, etc.)
2. **Expected Result**: The player stays visible and music keeps playing

### Step 5: Test Heartbeat Recommendations
1. Go to Home page
2. Click the heart icon to start scanning
3. Wait 10 seconds for the simulation to complete
4. **Expected Result**: 
   - If BPM < 90: Shows "Resting (Melody)" songs
   - If BPM 90-120: Shows "Happy" songs
   - If BPM > 120: Shows "Mass" songs
5. Click **Play** on any recommended song

### Step 6: Test Import Feature (Advanced)
Use a tool like Postman or curl to add a new song:

```bash
curl -X POST "http://localhost:8000/admin/import?title=Test%20Song&url=https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3&artist=Test%20Artist&mood=Happy"
```

Then search for "Test Song" and play it.

## 🎵 Current Song Database
All songs now use working external URLs:
1. Samajavaragamana (Happy)
2. Butta Bomma (Happy)
3. Mass Raja (Mass)
4. Ay Pilla (Melody)
5. Naatu Naatu (Mass)
6. Inkem Inkem (Happy)
7. Oo Antava (Mass)
8. Em Sandeham Ledu (Melody)
9. Ramuloo Ramulaa (Mass)
10. Chitti (Happy)

## 🔧 Troubleshooting

### If music doesn't play:
1. Check browser console for errors (F12)
2. Verify the backend is running: http://localhost:8000/songs
3. Try a different browser (Chrome recommended)

### If player doesn't appear:
1. Check that you clicked "Play" not "Download"
2. Refresh the page and try again
3. Check browser console for React errors

## 📝 API Endpoints

- `GET /songs` - List all songs
- `GET /songs/search?query=<term>` - Search songs
- `POST /analyze-mood?bpm=<number>` - Get mood-based recommendations
- `POST /admin/import` - Add new song with external URL
- `GET /download/{id}` - Stream/download song (redirects to external URL)

## ✨ Next Steps

To add real Telugu songs:
1. Find public domain or Creative Commons Telugu songs
2. Get direct MP3 URLs (from SoundCloud, Jamendo, etc.)
3. Use the `/admin/import` endpoint to add them
4. Or manually update the database with the `update_db.py` script
