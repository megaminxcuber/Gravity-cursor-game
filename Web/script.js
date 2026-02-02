const cursor = document.getElementById("cursor");
const target = document.getElementById("target");
const strengthSlider = document.getElementById("strength");
const directionSelect = document.getElementById("direction");
const scoreDisplay = document.getElementById("score");

let pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let vel = { x: 0, y: 0 };
let mouseForce = { x: 0, y: 0 };
let score = 0;

// Place target randomly
function placeTarget() {
  target.style.left = Math.random() * window.innerWidth + "px";
  target.style.top = Math.random() * window.innerHeight + "px";
}
placeTarget();

// Track mouse movement as external force
window.addEventListener("mousemove", (e) => {
  mouseForce.x = (e.clientX - pos.x) * 0.01;
  mouseForce.y = (e.clientY - pos.y) * 0.01;
});

function getGravityVector() {
  const strength = parseFloat(strengthSlider.value);
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
    score++;
    scoreDisplay.textContent = "Score: " + score;
    placeTarget();
  }
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
    vel.x *= -0.7; // reverse and dampen
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

  // Check collision with target
  checkCollision();

  requestAnimationFrame(animate);
}

animate();
