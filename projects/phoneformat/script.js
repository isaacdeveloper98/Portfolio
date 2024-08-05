document.getElementById('formatButton').addEventListener('click', () => {
    const phoneInput = document.getElementById('phoneInput').value;
    const numbers = phoneInput.replace(/\D/g, '');
    const lastTen = numbers.slice(-10);

    if (lastTen.length === 10) {
        const formattedNumber = `${lastTen.slice(0, 3)}-${lastTen.slice(3, 6)}-${lastTen.slice(6)}`;
        document.getElementById('formattedNumber').textContent = formattedNumber;

        //copy number
        navigator.clipboard.writeText(formattedNumber)
            .then(() => {
                alert('Formatted number copied to clipboard');
            })
            .catch(err => {
                console.error('Failed to copy:', err);
            });
    } else {
        document.getElementById('formattedNumber').textContent = 'Invalid number';
    }
});

//background and star trail effect
const canvasStars = document.getElementById('stars');
const ctxStars = canvasStars.getContext('2d');
canvasStars.width = window.innerWidth;
canvasStars.height = window.innerHeight;

const canvasSolarSystem = document.getElementById('solar-system');
const ctxSolarSystem = canvasSolarSystem.getContext('2d');
canvasSolarSystem.width = window.innerWidth;
canvasSolarSystem.height = window.innerHeight;

const canvasStarTrail = document.getElementById('star-trail');
const ctxStarTrail = canvasStarTrail.getContext('2d');
canvasStarTrail.width = window.innerWidth;
canvasStarTrail.height = window.innerHeight;

const stars = [];
const starCount = 200;
const starTrailColors = ['#ffffff', '#ff69b4', '#ffff00', '#00ff00', '#ff0000', '#800080'];
const planets = [
    { radius: 50, distance: 150, speed: 0.01, color: '#ff4500' },
    { radius: 30, distance: 250, speed: 0.008, color: '#1e90ff' },
    { radius: 40, distance: 350, speed: 0.006, color: '#32cd32' },
    { radius: 20, distance: 450, speed: 0.004, color: '#ff69b4' }
];
const sun = { x: canvasSolarSystem.width / 2, y: canvasSolarSystem.height / 2, radius: 60, color: '#ffd700' };

for (let i = 0; i < starCount; i++) {
    stars.push({
        x: Math.random() * canvasStars.width,
        y: Math.random() * canvasStars.height,
        radius: Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
    });
}

function drawStars() {
    ctxStars.clearRect(0, 0, canvasStars.width, canvasStars.height);
    stars.forEach(star => {
        ctxStars.beginPath();
        ctxStars.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
        ctxStars.fillStyle = '#ffffff';
        ctxStars.fill();

        star.x += star.speedX;
        star.y += star.speedY;

        if (star.x < 0) star.x = canvasStars.width;
        if (star.x > canvasStars.width) star.x = 0;
        if (star.y < 0) star.y = canvasStars.height;
        if (star.y > canvasStars.height) star.y = 0;
    });
    requestAnimationFrame(drawStars);
}

function drawSolarSystem() {
    ctxSolarSystem.clearRect(0, 0, canvasSolarSystem.width, canvasSolarSystem.height);

    // Sun
    ctxSolarSystem.beginPath();
    ctxSolarSystem.arc(sun.x, sun.y, sun.radius, 0, 2 * Math.PI);
    ctxSolarSystem.fillStyle = sun.color;
    ctxSolarSystem.fill();

    // Planets
    planets.forEach(planet => {
        planet.angle = (planet.angle || 0) + planet.speed;
        const x = sun.x + planet.distance * Math.cos(planet.angle);
        const y = sun.y + planet.distance * Math.sin(planet.angle);
        ctxSolarSystem.beginPath();
        ctxSolarSystem.arc(x, y, planet.radius, 0, 2 * Math.PI);
        ctxSolarSystem.fillStyle = planet.color;
        ctxSolarSystem.fill();
    });

    requestAnimationFrame(drawSolarSystem);
}

drawStars();
drawSolarSystem();

let trail = [];
const trailLength = 20;

canvasStarTrail.addEventListener('mousemove', (event) => {
    const trailDot = {
        x: event.clientX,
        y: event.clientY,
        radius: 3,
        color: starTrailColors[Math.floor(Math.random() * starTrailColors.length)],
        life: 2000, 
        createdAt: Date.now(),
        brightness: Math.random() * 0.5 + 0.5,
    };
    trail.push(trailDot);

    if (trail.length > trailLength) {
        trail.shift();
    }

    ctxStarTrail.clearRect(0, 0, canvasStarTrail.width, canvasStarTrail.height);
    trail.forEach(dot => {
        const age = Date.now() - dot.createdAt;
        if (age > dot.life) {
            return;
        }

        dot.brightness += (Math.random() - 0.5) * 0.1;
        dot.brightness = Math.max(0, Math.min(1, dot.brightness));

        dot.x += (Math.random() - 0.5) * 2;
        dot.y += (Math.random() - 0.5) * 2; 

        ctxStarTrail.beginPath();
        ctxStarTrail.moveTo(dot.x - dot.radius, dot.y);
        ctxStarTrail.lineTo(dot.x, dot.y - dot.radius);
        ctxStarTrail.lineTo(dot.x + dot.radius, dot.y);
        ctxStarTrail.lineTo(dot.x, dot.y + dot.radius);
        ctxStarTrail.closePath();
        ctxStarTrail.fillStyle = `rgba(${hexToRgb(dot.color)},${dot.brightness})`;
        ctxStarTrail.fill();
    });
    trail = trail.filter(dot => Date.now() - dot.createdAt <= dot.life);
});

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r},${g},${b}`;
}
