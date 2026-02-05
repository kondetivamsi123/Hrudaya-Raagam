# Hrudaya Raagam - AI-Powered Music App

## Overview
Hrudaya Raagam is a biometric-aware music player that detects mood via heart rate (simulated) and provides Telugu music recommendations.

## Tech Stack
- **Frontend**: React, Vite, Vanilla CSS (Premium Dark Theme)
- **Backend**: Python, FastAPI, SQLAlchemy, SQLite
- **Auth**: JWT (JSON Web Tokens)

## Prerequisites
- Node.js (v18+)
- Python 3.10+

## Setup & Run

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```
Runs on: `http://localhost:8000`
Docs: `http://localhost:8000/docs`

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on: `http://localhost:5175` (or similar port)

## Features Implemented
- **Authentication**: Signup & Login with JWT.
- **Heartbeat Scanner**: Simulated BPM detection and mood analysis.
- **Search**: Fuzzy search for songs.
- **Library/Playlists**: Database models and basic UI.
- **Downloads**: Backend file serving and frontend download links.
