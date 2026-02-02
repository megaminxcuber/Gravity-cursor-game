const cursor = document.getElementById("cursor");
const strengthSlider = document.getElementById("strength");
const directionSelect = document.getElementById("direction");

let pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let vel = { x: 0, y: 0 };
let mouseForce = { x: 0, y: 0 };

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

function animate() {
  const gravity = getGravityVector();

  // Apply gravity + mouse force
  vel.x += gravity.x + mouseForce.x;
  vel.y += gravity.y + mouseForce.y;

  // Update position
  pos.x += vel.x;
  pos.y += vel.y;

  // Clamp to screen bounds
  pos.x = Math.max(0, Math.min(window.innerWidth, pos.x));
  pos.y = Math.max(0, Math.min(window.innerHeight, pos.y));

  // Render
  cursor.style.left = pos.x + "px";
  cursor.style.top = pos.y + "px";

  // Decay velocity & mouse force
  vel.x *= 0.9;
  vel.y *= 0.9;
  mouseForce.x *= 0.5;
  mouseForce.y *= 0.5;

  requestAnimationFrame(animate);
}

animate();
