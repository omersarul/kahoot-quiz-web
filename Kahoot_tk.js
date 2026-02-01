const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const db = require("./db");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));
app.use(express.json());

// Aktif yarışma bilgileri
let activeQuizId = null;
let currentQuestionIndex = 0;
let answers = {}; // socket.id -> {answer, studentName}
let studentNames = {}; // socket.id -> name

async function getActiveQuiz() {
  if (!activeQuizId) return null;
  return await db.getQuizById(activeQuizId);
}

function getLastQuestion(quiz) {
  // currentQuestionIndex, bir sonraki soruya ayarlanmış oluyor;
  // son gönderilen soruyu bulmak için 1 geri geliyoruz
  const idx =
    (currentQuestionIndex - 1 + quiz.questions.length) %
    quiz.questions.length;
  return quiz.questions[idx];
}

// ====== REST API – Hocanın paneli için ======

// Tüm testleri getir
app.get("/api/quizzes", async (req, res) => {
  const quizzes = await db.getAllQuizzes();
  res.json(quizzes);
});

// Yeni test kaydet
app.post("/api/quizzes", async (req, res) => {
  const { name, questions } = req.body;

  if (!name || !questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: "Geçersiz quiz verisi" });
  }

  const quizId = Date.now().toString();

  try {
    const quiz = await db.createQuiz(quizId, name, questions);
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Quiz kaydedilirken hata oluştu" });
  }
});

// Hangi testin kullanılacağını seç
app.post("/api/select-quiz", async (req, res) => {
  const { quizId } = req.body;
  const quiz = await db.getQuizById(quizId);

  if (!quiz) {
    return res.status(404).json({ error: "Quiz bulunamadı" });
  }

  activeQuizId = quizId;
  currentQuestionIndex = 0;
  answers = {};

  res.json({ ok: true, name: quiz.name, questionCount: quiz.questions.length });
});

// ====== Socket.io – Oyun akışı ======

io.on("connection", (socket) => {
  console.log("Bir kullanıcı bağlandı:", socket.id);

  // Student joined with name
  socket.on("student-joined", (data) => {
    studentNames[socket.id] = data.name;
    console.log("Öğrenci katıldı:", data.name, socket.id);
  });

  // Host: Soruyu başlat (seçili testten sıradaki soru)
  socket.on("send-question", async () => {
    const quiz = await getActiveQuiz();
    if (!quiz) {
      // aktif test yoksa host'a haber ver
      socket.emit("no-quiz-selected");
      return;
    }

    if (quiz.questions.length === 0) return;

    const question = quiz.questions[currentQuestionIndex];

    console.log("Soru başlatıldı:", question.text);

    answers = {};

    io.emit("new-question", {
      question: question.text,
      options: question.options,
      quizName: quiz.name,
      questionNumber: currentQuestionIndex + 1,
      totalQuestions: quiz.questions.length,
    });

    currentQuestionIndex++;
    if (currentQuestionIndex >= quiz.questions.length) {
      currentQuestionIndex = 0; // sona gelince başa sar
    }
  });

  // Oyuncu cevap gönderdi
  socket.on("answer", async (data) => {
    const quiz = await getActiveQuiz();
    if (!quiz) return;

    const answer = typeof data === 'string' ? data : data.answer;
    const studentName = typeof data === 'object' ? data.studentName : 'Anonim';

    answers[socket.id] = { answer, studentName };
    console.log("Cevap geldi:", studentName, answer);

    const currentQ = getLastQuestion(quiz);
    const isCorrect = answer === currentQ.correct;

    socket.emit("answer-result", {
      correct: isCorrect,
      correctAnswer: currentQ.correct,
    });

    const total = Object.keys(answers).length;
    let correctCount = 0;
    const answerDetails = [];

    Object.entries(answers).forEach(([socketId, answerData]) => {
      const ans = typeof answerData === 'string' ? answerData : answerData.answer;
      const name = typeof answerData === 'object' ? answerData.studentName : 'Anonim';
      const correct = ans === currentQ.correct;

      if (correct) correctCount++;
      answerDetails.push({ name, answer: ans, correct });
    });

    const wrongCount = total - correctCount;

    io.emit("stats-update", {
      total,
      correct: correctCount,
      wrong: wrongCount,
      details: answerDetails
    });
  });

  socket.on("disconnect", () => {
    console.log("Kullanıcı ayrıldı:", socket.id);
    delete answers[socket.id];
    delete studentNames[socket.id];
  });
});

const PORT = process.env.PORT || 3000;

// Initialize database and start server
db.initDatabase()
  .then(() => {
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Kahoot klonun hazır -> http://localhost:${PORT}`);
      console.log(`📊 Database bağlantısı aktif`);
    });
  })
  .catch((error) => {
    console.error('❌ Database başlatılamadı:', error);
    process.exit(1);
  });
