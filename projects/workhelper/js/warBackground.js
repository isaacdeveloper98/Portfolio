
// warBackground.js

const canvas = document.getElementById("battlefield");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = Math.max(window.innerHeight, document.body.scrollHeight);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
window.addEventListener("scroll", () => {
  resizeCanvas();
});


function drawHuman(x, y) {
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2); // head
  ctx.moveTo(x, y + 4);
  ctx.lineTo(x, y + 12); // body
  ctx.moveTo(x - 4, y + 8);
  ctx.lineTo(x + 4, y + 8); // arms
  ctx.moveTo(x, y + 12);
  ctx.lineTo(x - 3, y + 18); // left leg
  ctx.moveTo(x, y + 12);
  ctx.lineTo(x + 3, y + 18); // right leg
  ctx.stroke();
}

function drawGoblin(x, y) {
  ctx.fillStyle = "green";
  ctx.fillRect(x - 2, y, 4, 8); // body
  ctx.fillRect(x - 1, y - 4, 2, 2); // head
  ctx.fillRect(x - 4, y + 2, 1, 3); // dagger left
  ctx.fillRect(x + 3, y + 2, 1, 3); // dagger right
}

function drawDragon(x, y) {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 10, y - 10);
  ctx.lineTo(x + 20, y);
  ctx.closePath();
  ctx.fill(); // wings
  ctx.fillRect(x + 5, y + 5, 10, 5); // body
  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.arc(x + 20, y + 5, 5, 0, Math.PI); // fire breath
  ctx.fill();
}

function drawElf(x, y) {
  ctx.strokeStyle = "cyan";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2); // head
  ctx.moveTo(x, y + 3);
  ctx.lineTo(x, y + 10); // body
  ctx.stroke();
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(x + 6, y + 2, 2, 0, Math.PI * 2); // magic orb
  ctx.fill();
}

function drawUndead(x, y) {
  ctx.strokeStyle = "purple";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2); // head
  ctx.moveTo(x, y + 3);
  ctx.lineTo(x, y + 10); // body
  ctx.stroke();
  ctx.fillStyle = "magenta";
  ctx.fillRect(x - 2, y + 10, 4, 2); // feet
}


const entities = [];
const maxEntities = 60;

function spawnEntity() {
  if (entities.length >= maxEntities) return;
  const types = ["human", "goblin", "dragon", "elf", "undead"];
  const type = types[Math.floor(Math.random() * types.length)];
  const x = Math.random() * width;
  const y = height - 100 - Math.random() * 150;
  const direction = Math.random() < 0.5 ? -1 : 1;
  const speed = Math.random() * 0.5 + 0.5;
  const hp = 100;
  entities.push({ x, y, type, direction, speed, hp });
}

function drawEntity(e) {
  switch (e.type) {
    case "human": drawHuman(e.x, e.y); break;
    case "goblin": drawGoblin(e.x, e.y); break;
    case "dragon": drawDragon(e.x, e.y); break;
    case "elf": drawElf(e.x, e.y); break;
    case "undead": drawUndead(e.x, e.y); break;
  }
}

function updateEntities() {
  for (let i = entities.length - 1; i >= 0; i--) {
    const e = entities[i];
    e.x += e.speed * e.direction;
    e.y += Math.sin(Date.now() / 300 + i) * 0.5; // subtle bobbing

    if (Math.random() < 0.01 && e.type === "elf") {
      spawnParticle(e.x + 5, e.y, "cyan");
    }
    if (Math.random() < 0.01 && e.type === "dragon") {
      spawnParticle(e.x + 10, e.y + 2, "orange");
    }

    drawEntity(e);

    if (e.x < -50 || e.x > width + 50) {
      entities.splice(i, 1);
    }
  }
}

const particles = [];
function spawnParticle(x, y, color) {
  particles.push({ x, y, dx: (Math.random() - 0.5) * 2, dy: -Math.random(), life: 50, color });
}

function drawParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.dx;
    p.y += p.dy;
    p.life--;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();

    if (p.life <= 0) particles.splice(i, 1);
  }
}

function drawTerrain() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, height - 60, width, 60);

  for (let i = 0; i < width; i += 200) {
    ctx.fillStyle = "#333";
    ctx.fillRect(i + 30, height - 50, 30, 20); // huts
  }

  for (let i = 0; i < width; i += 300) {
    ctx.beginPath();
    ctx.arc(i + 50, height - 20, 10, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 80, 0, 0.4)";
    ctx.fill();
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  drawTerrain();
  drawParticles();
  updateEntities();

  if (Math.random() < 0.1) spawnEntity();
  requestAnimationFrame(animate);
}

animate();
