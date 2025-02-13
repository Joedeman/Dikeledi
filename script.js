const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const width = canvas.width;
const height = canvas.height;

let particles = [];
let scaleFactor = 1; // For heartbeat scaling
let scaleDirection = 1; // Direction of scaling (1 for expanding, -1 for contracting)
const beatInterval = 100; // Time between heartbeats
const heartbeatEchoes = []; // For storing echo hearts

function createHeartPoints() {
  let points = [];
  for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
    const x = 16 * Math.sin(angle) ** 3;
    const y = 13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle);
    points.push({ x, y });
  }
  return points;
}

const heartPoints = createHeartPoints();

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.opacity = Math.random() * 1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity -= 0.01;
    if (this.opacity <= 0) {
      this.opacity = 0;
    }
  }

  draw() {
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function initParticles() {
  particles = []; // Reset particles for cleanliness
  for (let i = 0; i < heartPoints.length * 10; i++) {
    const randomPoint = heartPoints[Math.floor(Math.random() * heartPoints.length)];
    const x = randomPoint.x * 15 * scaleFactor + width / 2;
    const y = -randomPoint.y * 15 * scaleFactor + height / 2;
    particles.push(new Particle(x, y));
  }
}

function createHeartbeatEcho() {
  heartbeatEchoes.push({
    scale: scaleFactor,
    opacity: 1,
  });
}

function drawHeartbeatEchoes() {
  heartbeatEchoes.forEach((echo, index) => {
    ctx.globalAlpha = echo.opacity;
    ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    heartPoints.forEach((point, i) => {
      const x = point.x * 15 * echo.scale + width / 2;
      const y = -point.y * 15 * echo.scale + height / 2;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.stroke();
    echo.opacity -= 0.02; // Fade out
    echo.scale += 0.02; // Expand slightly
    if (echo.opacity <= 0) {
      heartbeatEchoes.splice(index, 1); // Remove finished echoes
    }
  });
}

function drawText() {
  // Draw "I Love You" inside the heart
  const gradient = ctx.createLinearGradient(width / 2 - 100, height / 2, width / 2 + 100, height / 2);
  gradient.addColorStop(0, "pink");
  gradient.addColorStop(1, "red");

  ctx.font = "bold 60px 'Comic Sans MS', cursive";
  ctx.fillStyle = gradient;
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(255, 182, 193, 0.8)";
  ctx.shadowBlur = 10;
  ctx.fillText("I Love You", width / 2, height / 2);

  // Draw "Sweetheart" below "I Love You"
  ctx.font = "bold 50px 'Comic Sans MS', cursive"; // Adjust font size
  ctx.fillStyle = "pink";
  ctx.shadowBlur = 5;
  ctx.fillText("Sweetheart", width / 2, height / 2 + 60); // Move it below
}


function animate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawHeartbeatEchoes(); // Draw echo hearts
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  drawText(); // Draw the love letter text inside and outside the heart

  // Handle heartbeat scaling
  scaleFactor += 0.01 * scaleDirection;
  if (scaleFactor >= 1.2 || scaleFactor <= 1) {
    scaleDirection *= -1; // Reverse direction at thresholds
    if (scaleDirection === -1) {
      createHeartbeatEcho(); // Create echo when heart starts contracting
    }
  }

  requestAnimationFrame(animate);
}

// Initialize and reinitialize particles every beat interval
initParticles();
setInterval(initParticles, beatInterval * 10);
animate();
