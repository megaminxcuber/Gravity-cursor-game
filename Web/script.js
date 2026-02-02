const cursor = document.getElementById("cursor");
const target = document.getElementById("target");
const strengthSlider = document.getElementById("strength");
const directionSelect = document.getElementById("direction");
const scoreDisplay = document.getElementById("score");
const moveTargetBtn = document.getElementById("moveTarget");

let pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let vel = { x: 0, y: 0 };
let mouseForce = { x: 0, y: 0 };
let score = 0;
let highScore = 0;
let lastHitTime = 0;
let difficulty = "easy"; // default mode

// Load scores from localStorage
if (localStorage.getItem("gravityScore")) {
  score = parseInt(localStorage.getItem("gravityScore"), 10);
}
if (localStorage.getItem("gravityHighScore")) {
  highScore = parseInt(localStorage.getItem("gravityHighScore"), 10);
}
updateScoreDisplay();

// Place target randomly
function placeTarget() {
  target.style.left = Math.random() * window.innerWidth + "px";
  target.style.top = Math.random() * window.innerHeight + "px";
}
placeTarget();

// Button click moves target
moveTargetBtn.addEventListener("click", placeTarget);

// Track mouse movement as external force
window.addEventListener("mousemove", (e) => {
  mouseForce.x = (e.clientX - pos.x) * 0.01;
  mouseForce.y = (e.clientY - pos.y) * 0.01;
});

function getGravityVector() {
  let strength = parseFloat(strengthSlider.value);

  // Difficulty modes
  if (difficulty === "easy") strength *= 0.5;
  if (difficulty === "hard") strength *= 1.5;
  if (difficulty === "chaos") {
    // Random direction every frame
    const angle = Math.random() * Math.PI * 2;
    return { x: Math.cos(angle) * strength, y: Math.sin(angle) * strength };
  }

  switch (directionSelect.value) {
    case "down":
      return { x: 0, y: strength };
    case "up":
      return { x: 0, y: -strength };
    case "left":
      return { x: -strength, y: 0 };
    case "right":
      return { x: strength, y: 0 };
    case "diag":
      return { x: strength, y: strength };
  }
}

function checkCollision() {
  const cursorRect = cursor.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const dx = cursorRect.left - targetRect.left;
  const dy = cursorRect.top - targetRect.top;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < 25) {
    // collision radius
    const gravityStrength = parseFloat(strengthSlider.value);
    let points = Math.max(1, Math.round(gravityStrength * 10));

    // Combo bonus: if hit within 3s of last hit, double points
    const now = Date.now();
    if (now - lastHitTime < 3000) {
      points *= 2;
    }
    lastHitTime = now;

    score += points;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("gravityHighScore", highScore);
    }

    updateScoreDisplay(points);
    localStorage.setItem("gravityScore", score);
    placeTarget();
  }
}

function updateScoreDisplay(lastPoints = 0) {
  scoreDisplay.textContent =
    `Score: ${score} (High: ${highScore})` +
    (lastPoints > 0 ? ` (+${lastPoints})` : "");
}

function animate() {
  const gravity = getGravityVector();

  // Apply gravity + mouse force
  vel.x += gravity.x + mouseForce.x;
  vel.y += gravity.y + mouseForce.y;

  // Update position
  pos.x += vel.x;
  pos.y += vel.y;

  // Bounce off walls
  if (pos.x <= 0 || pos.x >= window.innerWidth) {
    vel.x *= -0.7;
    pos.x = Math.max(0, Math.min(window.innerWidth, pos.x));
  }
  if (pos.y <= 0 || pos.y >= window.innerHeight) {
    vel.y *= -0.7;
    pos.y = Math.max(0, Math.min(window.innerHeight, pos.y));
  }

  // Render cursor
  cursor.style.left = pos.x + "px";
  cursor.style.top = pos.y + "px";

  // Decay forces
  vel.x *= 0.95;
  vel.y *= 0.95;
  mouseForce.x *= 0.5;
  mouseForce.y *= 0.5;

  // Check collision
  checkCollision();

  requestAnimationFrame(animate);
}

animate();

// 🎮 Keyboard shortcuts
window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "r") {
    placeTarget(); // respawn target
  }
  if (e.key.toLowerCase() === "c") {
    score = 0;
    updateScoreDisplay();
    localStorage.setItem("gravityScore", score);
  }
  if (e.key.toLowerCase() === "1") difficulty = "easy";
  if (e.key.toLowerCase() === "2") difficulty = "hard";
  if (e.key.toLowerCase() === "3") difficulty = "chaos";
});
