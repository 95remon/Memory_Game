const colors = ["red", "green", "blue", "yellow", "pink", "orange", "cyan", "purple"];
const buttons = document.querySelectorAll(".btn");
const startBtn = document.getElementById("startBtn");
const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

const popup = document.getElementById("popup");
const finalScoreText = document.getElementById("finalScore");

let sequence = [];
let userSequence = [];
let score = 0;
let highScore = 0;

// Sounds for each color
const colorSoundMap = {
  red: new Audio("sounds/1.mp3"),
  green: new Audio("sounds/2.mp3"),
  blue: new Audio("sounds/3.mp3"),
  yellow: new Audio("sounds/4.mp3"),
  pink: new Audio("sounds/5.mp3"),
  orange: new Audio("sounds/6.mp3"),
  cyan: new Audio("sounds/7.mp3"),
  purple: new Audio("sounds/8.mp3")
};

// Fail sound
const failSound = new Audio("sounds/fail.mp3");

function playSound(color) {
  const sound = colorSoundMap[color];
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function flashColor(color) {
  const btn = document.querySelector(`.btn.${color}`);
  btn.classList.add("active");
  playSound(color);
  setTimeout(() => btn.classList.remove("active"), 500);
}

async function playSequence() {
  for (let color of sequence) {
    flashColor(color);
    await sleep(700);
  }
}

function nextRound() {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  sequence.push(randomColor);
  userSequence = [];
  playSequence();
}

function resetGame() {
  failSound.currentTime = 0;
  failSound.play();
  finalScoreText.textContent = score;
  popup.classList.remove("hidden");
}

function updateScore() {
  score++;
  scoreText.textContent = score;
  if (score > highScore) {
    highScore = score;
    highScoreText.textContent = highScore;
  }
}

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const clickedColor = btn.dataset.color;
    userSequence.push(clickedColor);
    flashColor(clickedColor);
    const currentStep = userSequence.length - 1;
    if (userSequence[currentStep] !== sequence[currentStep]) {
      resetGame();
      return;
    }
    if (userSequence.length === sequence.length) {
      updateScore();
      setTimeout(nextRound, 800);
    }
  });
});

startBtn.addEventListener("click", () => {
  popup.classList.add("hidden");
  sequence = [];
  userSequence = [];
  score = 0;
  scoreText.textContent = score;
  nextRound();
});

function closePopup() {
  popup.classList.add("hidden");
  sequence = [];
  userSequence = [];
  score = 0;
  scoreText.textContent = score;
}

function layoutButtonsInCircle() {
  const radius = 120;
  const angleStep = 360 / colors.length;

  buttons.forEach((btn, index) => {
    const angle = angleStep * index;
    const radians = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radians);
    const y = radius * Math.sin(radians);

    btn.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
  });
}

layoutButtonsInCircle();
