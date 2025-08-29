const quizzes = {
  allgemein: quizAllgemein,
  geo: quizGeo,
  sport: quizSport,
  geschichte: quizGeschichte,
  ip: quizIP,
};

let currentQuiz = null;
let currentQuestionIndex = 0;
let score = 0;

function startQuiz(quizKey) {
  stopFireworks();
  currentQuiz = quizzes[quizKey];
  currentQuestionIndex = 0;
  score = 0;
  document.querySelector(".quiz-selection").classList.add("hidden");
  document.getElementById("quiz-container").classList.remove("hidden");
  document.getElementById("quiz-title").textContent = currentQuiz.title;
  showQuestion();
}

function showQuestion() {
  const question = currentQuiz.questions[currentQuestionIndex];
  const container = document.getElementById("question-container");
  document.getElementById("progress").textContent =
    `Frage ${currentQuestionIndex + 1} von ${currentQuiz.questions.length}`;
  container.innerHTML = `<h3>${question.q}</h3>`;
  
  question.a.forEach((answer, i) => {
    const btn = document.createElement("button");
    btn.textContent = answer;
    btn.classList.add("answer-btn");
    btn.onclick = () => selectAnswer(i);
    container.appendChild(btn);
  });

  document.getElementById("next-btn").classList.add("hidden");
  document.getElementById("end-buttons").classList.add("hidden");
}

function selectAnswer(i) {
  const question = currentQuiz.questions[currentQuestionIndex];
  const buttons = document.querySelectorAll(".answer-btn");
  buttons.forEach((btn, index) => {
    btn.disabled = true;
    if (index === question.correct) {
      btn.classList.add("correct");
    } else if (index === i) {
      btn.classList.add("wrong");
    }
  });

  if (i === question.correct) {
    score++;
    document.querySelector(".container").classList.add("correct-animation");
    setTimeout(() => {
      document.querySelector(".container").classList.remove("correct-animation");
      nextQuestion();
    }, 1000);
  } else {
    document.getElementById("next-btn").classList.remove("hidden");
  }
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuiz.questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  const container = document.getElementById("question-container");
  document.getElementById("progress").textContent = "";
  container.innerHTML = `<h3>Du hast ${score} von ${currentQuiz.questions.length} Punkten erreicht 🎉</h3>`;
  document.getElementById("next-btn").classList.add("hidden");
  document.getElementById("end-buttons").classList.remove("hidden");

  if (score === currentQuiz.questions.length) {
    startFireworks();
  }
}

function restartQuiz() {
  stopFireworks();
  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
}

function backToMenu() {
  stopFireworks();
  document.getElementById("quiz-container").classList.add("hidden");
  document.querySelector(".quiz-selection").classList.remove("hidden");
}

/* --------------------
   Feuerwerk Animation
--------------------- */
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
let fireworksActive = false;
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createFirework(x, y) {
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: x,
      y: y,
      vx: random(-5, 5),
      vy: random(-5, 5),
      life: 100,
      color: `hsl(${Math.random() * 360}, 100%, 60%)`
    });
  }
}

function animateFireworks() {
  if (!fireworksActive) return;
  requestAnimationFrame(animateFireworks);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.05;
    p.life--;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 3, 3);
    if (p.life <= 0) particles.splice(i, 1);
  });

  if (Math.random() < 0.05) {
    createFirework(random(100, canvas.width-100), random(100, canvas.height/2));
  }
}

function startFireworks() {
  fireworksActive = true;
  animateFireworks();
}

function stopFireworks() {
  fireworksActive = false;
  particles = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
