const topRod = document.getElementById("top-rod");
const bottomRod = document.getElementById("bottom-rod");
const ball = document.getElementById("ball");
const scoreboard = document.getElementById("scoreboard");

const gameContainerWidth = window.innerWidth;
const gameContainerHeight = window.innerHeight;
const rodSpeed = 10;
let ballX = gameContainerWidth / 2;
let ballY = gameContainerHeight / 2;
let ballSpeedX = 3;
let ballSpeedY = 3;
let score = 0;
let maxScore = localStorage.getItem("maxScore") || 0;
let maxScorePlayer = localStorage.getItem("maxScorePlayer") || "N/A";

function moveRods(event) {
  if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") {
    moveRod(topRod, -rodSpeed);
    moveRod(bottomRod, -rodSpeed);
  } else if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") {
    moveRod(topRod, rodSpeed);
    moveRod(bottomRod, rodSpeed);
  }
}

function moveRod(rod, speed) {
  const currentPosition = parseInt(rod.style.left) || 0;
  const newPosition = currentPosition + speed;
  if (newPosition >= 0 && newPosition <= gameContainerWidth - 80) {
    rod.style.left = newPosition + "px";
  }
}

function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX <= 0 || ballX >= gameContainerWidth - 10) {
    // Ball hits the left or right wall
    ballSpeedX *= -1;
  }

  if (ballY <= 0 || ballY >= gameContainerHeight - 10) {
    // Ball hits the top or bottom wall
    ballY = gameContainerHeight / 2;
    ballX = gameContainerWidth / 2;

    if (score > maxScore) {
      maxScore = score;
      maxScorePlayer = "Player 2";
      localStorage.setItem("maxScore", maxScore);
      localStorage.setItem("maxScorePlayer", maxScorePlayer);
    }
    alert("Player 1 wins! Score: " + score);
    score = 0;
  } else if (checkCollision(topRod) || checkCollision(bottomRod)) {
    // Ball hits the rod
    score++;
    ballSpeedY *= -1;
  }

  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";

  requestAnimationFrame(moveBall);
}

function checkCollision(rod) {
  const rodRect = rod.getBoundingClientRect();
  const ballRect = ball.getBoundingClientRect();

  return (
    ballRect.left < rodRect.right &&
    ballRect.right > rodRect.left &&
    ballRect.top < rodRect.bottom &&
    ballRect.bottom > rodRect.top
  );
}

function resetRods() {
  topRod.style.left = gameContainerWidth / 2 - 40 + "px";
  bottomRod.style.left = gameContainerWidth / 2 - 40 + "px";
}

function startGame(event) {
  if (event.key === "Enter") {
    resetRods();
    ballX = gameContainerWidth / 2;
    ballY = gameContainerHeight / 2;
    score = 0;
    alert("Highest Score: " + maxScorePlayer + " - " + maxScore);
  }
}

window.addEventListener("keydown", moveRods);
window.addEventListener("keydown", startGame);
moveBall();