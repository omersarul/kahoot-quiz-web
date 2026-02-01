# kahoot-quiz-web
For_tk

# 🎓 Kahoot Clone - Interactive Quiz Platform

A real-time interactive quiz application similar to Kahoot, built for university education.

## 🌟 Features

- **Teacher Panel**: Create and manage quizzes
- **Host Panel**: Send questions to students in real-time
- **Student Interface**: Answer questions from any device
- **Real-time Statistics**: Track correct/wrong answers live
- **Mobile-Optimized**: Works perfectly on phones and tablets

## 🚀 Quick Start

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open in browser:
```
http://localhost:3000/app.html
```

## 📱 Usage

### For Teachers:
1. Click "👨‍🏫 Öğretmen"
2. Create quizzes or select existing ones
3. Click "🚀 Seçili Testi Aktif Et"
4. Switch to "🎮 Host Paneli" tab
5. Click "Soruyu Başlat 🚀" to send questions

### For Students:
1. Click "👨‍🎓 Öğrenci"
2. Wait for questions
3. Select answers
4. See results immediately

## 🔧 Technology Stack

- **Backend**: Node.js + Express
- **Real-time**: Socket.io
- **Frontend**: Vanilla JavaScript + CSS
- **Database**: PostgreSQL

## 📦 Dependencies

- express: ^5.2.1
- socket.io: ^4.8.3
- pg: ^8.13.1

## 🌐 Deployment to Render

### 1. Setup PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"PostgreSQL"**
3. Fill in the details:
   - **Name**: kahoot-db (or any name you prefer)
   - **Database**: kahoot_db
   - **User**: will be auto-generated
   - **Region**: Choose closest to you
   - **Plan**: Free
4. Click **"Create Database"**
5. **Copy the Internal Database URL** (starts with `postgresql://`)

### 2. Deploy Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Fill in the details:
   - **Name**: kahoot-quiz-web
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
4. Add Environment Variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the Internal Database URL from step 1
5. Click **"Create Web Service"**

### 3. Access Your Application

Once deployed, Render will provide you a URL like:
```
https://kahoot-quiz-web.onrender.com/app.html
```

**Note**: The free tier may sleep after inactivity. First request might be slow.

## 💻 Local Development Setup

1. Install PostgreSQL locally
2. Create a database:
```bash
createdb kahoot_db
```
3. Copy environment variables:
```bash
cp .env.example .env
```
4. Edit `.env` and set your local database URL:
```
DATABASE_URL=postgresql://username:password@localhost:5432/kahoot_db
```
5. Install dependencies:
```bash
npm install
```
6. Start the server:
```bash
npm start
```

Environment variables:
- `PORT` - Server port (auto-assigned by platform)

## 📄 License

ISC

