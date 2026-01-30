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
- **Storage**: JSON file system

## 📦 Dependencies

- express: ^5.2.1
- socket.io: ^4.8.3

## 🌐 Deployment

Deploy to Railway, Render, or any Node.js hosting platform.

Environment variables:
- `PORT` - Server port (auto-assigned by platform)

## 📄 License

ISC

