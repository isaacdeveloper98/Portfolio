// warBackground.js

const canvas = document.getElementById("battlefield");
const ctx = canvas.getContext("2d");
const toggleWarBtn = document.getElementById("toggleWarBtn"); 

let W_WIDTH = window.innerWidth;
let W_HEIGHT = window.innerHeight;

let isWarAnimationActive = true; 
let animationFrameId; 

let hillsData = [];
let hutsData = [];
let campfiresData = [];

const FACTION_ALLIANCE = 'alliance';
const FACTION_HORDE = 'horde';
const FACTION_DRAGON = 'dragon'; 

const DETECTION_RADIUS_GROUND = 150; 
const DETECTION_RADIUS_DRAGON = 250; 
const ATTACK_RANGE_MELEE = 30; 
const ATTACK_RANGE_DRAGON_BREATH = 100;
const ATTACK_COOLDOWN = 1000; 
const DRAGON_MIN_ALTITUDE = 50; 
const DRAGON_ATTACK_ALTITUDE_GROUND_TARGET = 70; 

const GROUND_LEVEL_Y = W_HEIGHT - 60; 

function initializeTerrain() {
  if (!W_WIDTH || !W_HEIGHT) { return; }
  hillsData = []; hutsData = []; campfiresData = [];
  const numHills = 5 + Math.floor(W_WIDTH / 400); 
  const hillBaseY = W_HEIGHT - 60;
  for (let i = 0; i < numHills; i++) {
    const hillWidth = W_WIDTH / (numHills -1 + Math.random()) + Math.random() * 100 - 50;
    const hillHeight = Math.random() * 70 + 40; 
    const sectionWidth = W_WIDTH / numHills;
    const hillX = (sectionWidth * i) + (Math.random() * (sectionWidth - hillWidth/2)) - hillWidth / 4;
    hillsData.push({ x: hillX, y: hillBaseY, width: hillWidth, height: hillHeight, color: `rgba(10, 10, 10, ${0.25 + Math.random() * 0.25})` });
  }
  const numHuts = Math.floor(W_WIDTH / 250) + 1; 
  for (let i = 0; i < numHuts; i++) {
    const hutWidth = 25 + Math.random() * 10; const hutHeight = 20 + Math.random() * 10; const roofHeight = 10 + Math.random() * 5;
    const sectionWidth = W_WIDTH / numHuts; const hutX = (sectionWidth * i) + (Math.random() * (sectionWidth - hutWidth));
    const hutY = W_HEIGHT - 60 - hutHeight;
    hutsData.push({ x: hutX, y: hutY, width: hutWidth, height: hutHeight, roofHeight: roofHeight, color: "#4a3b32", doorColor: "#2d231d" });
  }
  const numFires = Math.floor(W_WIDTH / 350) + 1;
  for (let i = 0; i < numFires; i++) {
    const sectionWidth = W_WIDTH / numFires; const fireX = (sectionWidth * i) + (Math.random() * (sectionWidth - 40)) + 20;
    const fireY = W_HEIGHT - 65;
    campfiresData.push({ x: fireX, y: fireY, rockColor: "#1a1a1a", isActive: Math.random() < 0.6 });
  }
}

function resizeCanvas() {
  W_WIDTH = window.innerWidth; W_HEIGHT = window.innerHeight; 
  if (canvas) { 
    canvas.width = W_WIDTH; canvas.height = W_HEIGHT;
    initializeTerrain(); 
  } else { console.error("warBackground.js: Canvas element not found during resize!"); }
}

const CHARACTER_VISUAL_HEIGHT = { 
    human: 20, elf: 23, goblin: 18, undead: 22, dragon: 0
};

function drawHuman(x, y, entity) { 
  if (!ctx) return; ctx.save(); ctx.translate(x, y);
  if (entity.direction === -1) { ctx.scale(-1, 1); }
  const attackLunge = (entity.state === 'attacking' && (Date.now() - entity.lastAttackTime < 200)) ? entity.direction * 5 : 0;
  ctx.fillStyle = "#aec6cf"; ctx.fillRect(-3 + attackLunge /2, -CHARACTER_VISUAL_HEIGHT.human + 4, 6, 10); 
  ctx.fillStyle = "#f0e0d0"; ctx.beginPath(); ctx.arc(0 + attackLunge/2, -CHARACTER_VISUAL_HEIGHT.human, 4, 0, Math.PI * 2); ctx.fill(); 
  ctx.fillStyle = "#708090"; ctx.fillRect(-3, -CHARACTER_VISUAL_HEIGHT.human + 14, 3, 6); ctx.fillRect(1, -CHARACTER_VISUAL_HEIGHT.human + 14, 3, 6);  
  ctx.fillStyle = "#f0e0d0"; ctx.fillRect(-5, -CHARACTER_VISUAL_HEIGHT.human + 5, 2, 6); ctx.fillRect(3 + attackLunge, -CHARACTER_VISUAL_HEIGHT.human + 5, 2, 6);  
  ctx.fillStyle = "#c0c0c0"; ctx.fillRect(4 + attackLunge, -CHARACTER_VISUAL_HEIGHT.human + 3, 2, 10); 
  ctx.fillStyle = "#8b4513"; ctx.fillRect(4 + attackLunge, -CHARACTER_VISUAL_HEIGHT.human + 13, 2, 2); 
  ctx.fillStyle = "#8B4513"; ctx.beginPath(); ctx.arc(-5, -CHARACTER_VISUAL_HEIGHT.human + 8, 4, Math.PI * 0.5, Math.PI * 1.5, false); ctx.fill(); 
  ctx.strokeStyle = "#654321"; ctx.lineWidth = 1; ctx.stroke();
  ctx.restore();
}
function drawGoblin(x, y, entity) { 
  if (!ctx) return; ctx.save(); ctx.translate(x, y);
  if (entity.direction === -1) { ctx.scale(-1, 1); }
  const attackLunge = (entity.state === 'attacking' && (Date.now() - entity.lastAttackTime < 200)) ? entity.direction * 4 : 0;
  ctx.fillStyle = "#556B2F"; ctx.fillRect(-4 + attackLunge/2, -CHARACTER_VISUAL_HEIGHT.goblin + 5, 8, 8);  
  ctx.beginPath(); ctx.arc(0 + attackLunge/2, -CHARACTER_VISUAL_HEIGHT.goblin, 5, 0, Math.PI * 2); ctx.fill(); 
  ctx.beginPath(); ctx.moveTo(-4, -CHARACTER_VISUAL_HEIGHT.goblin -3); ctx.lineTo(-7, -CHARACTER_VISUAL_HEIGHT.goblin -5); ctx.lineTo(-5, -CHARACTER_VISUAL_HEIGHT.goblin -1); ctx.closePath(); ctx.moveTo(4, -CHARACTER_VISUAL_HEIGHT.goblin -3); ctx.lineTo(7, -CHARACTER_VISUAL_HEIGHT.goblin -5); ctx.lineTo(5, -CHARACTER_VISUAL_HEIGHT.goblin -1); ctx.closePath(); ctx.fill(); 
  ctx.fillRect(-3, -CHARACTER_VISUAL_HEIGHT.goblin + 13, 3, 4); ctx.fillRect(1, -CHARACTER_VISUAL_HEIGHT.goblin + 13, 3, 4); 
  ctx.fillRect(-6, -CHARACTER_VISUAL_HEIGHT.goblin + 6, 2, 5); ctx.fillRect(4 + attackLunge, -CHARACTER_VISUAL_HEIGHT.goblin + 6, 2, 5); 
  ctx.fillStyle = "#8B4513"; ctx.fillRect(5 + attackLunge, -CHARACTER_VISUAL_HEIGHT.goblin + 4, 3, 8); ctx.beginPath(); ctx.arc(6.5 + attackLunge, -CHARACTER_VISUAL_HEIGHT.goblin + 3, 3, 0, Math.PI * 2); ctx.fill(); 
  ctx.restore();
}
function drawDragon(x, y, entity) { 
  if (!ctx) return; 
  const scale = 1.3; 
  ctx.save(); 
  ctx.translate(x, y);
  ctx.scale(scale, scale); 
  if (entity.direction === -1) { ctx.scale(-1, 1); }
  ctx.fillStyle = entity.dragonColor || "#B22222"; 
  ctx.beginPath(); ctx.moveTo(-15, 0); ctx.lineTo(0, -5); ctx.lineTo(10, 0); ctx.lineTo(15, -8); ctx.lineTo(12, -6); ctx.lineTo(10, -2); ctx.lineTo(5, 5); ctx.lineTo(-15, 5); ctx.closePath(); ctx.fill(); 
  const wingAngle = Math.sin(Date.now() * 0.005 + (entity.id || entity.y)) * 0.3; 
  
  // Use the wingColor property from the entity, with a fallback
  ctx.fillStyle = entity.wingColor || '#800000'; 
  
  ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(-10, -15 + Math.sin(wingAngle) * 10); ctx.lineTo(-20, -5 + Math.sin(wingAngle) * 5); ctx.closePath(); ctx.fill(); 
  ctx.beginPath(); ctx.moveTo(2, -3); ctx.lineTo(5, -13 + Math.sin(wingAngle + 0.5) * 8); ctx.lineTo(-5, -3 + Math.sin(wingAngle + 0.5) * 4); ctx.closePath(); ctx.fill(); 
  ctx.fillStyle = entity.dragonColor || "#B22222"; 
  ctx.fillRect(-5, 3, 3, 5); ctx.fillRect(3, 3, 3, 5); 
  if (entity.state === 'attacking' && entity.breathingFire && Math.random() < 0.7) { 
     const fireSourceX = entity.x + (entity.direction * 18 * scale); 
     const fireSourceY = entity.y - (5 * scale);                     
     spawnParticle(fireSourceX, fireSourceY, "orange", entity.direction, "fire_breath"); 
     spawnParticle(fireSourceX + (entity.direction * 4 * scale), fireSourceY + (1*scale), "yellow", entity.direction, "fire_breath"); 
  }
  ctx.restore();
}
function drawElf(x, y, entity) { 
  if (!ctx) return; ctx.save(); ctx.translate(x, y);
  if (entity.direction === -1) { ctx.scale(-1, 1); }
  const castEffect = (entity.state === 'attacking' && (Date.now() - entity.lastAttackTime < 300));
  ctx.fillStyle = "#228B22"; ctx.fillRect(-2, -CHARACTER_VISUAL_HEIGHT.elf + 4, 4, 12); 
  ctx.fillStyle = "#FFE4B5"; ctx.beginPath(); ctx.arc(0, -CHARACTER_VISUAL_HEIGHT.elf, 3.5, 0, Math.PI * 2); ctx.fill(); 
  ctx.beginPath(); ctx.moveTo(-2.5, -CHARACTER_VISUAL_HEIGHT.elf -1); ctx.lineTo(-5, -CHARACTER_VISUAL_HEIGHT.elf -4); ctx.lineTo(-4, -CHARACTER_VISUAL_HEIGHT.elf); ctx.closePath(); ctx.moveTo(2.5, -CHARACTER_VISUAL_HEIGHT.elf-1); ctx.lineTo(5, -CHARACTER_VISUAL_HEIGHT.elf-4); ctx.lineTo(4, -CHARACTER_VISUAL_HEIGHT.elf); ctx.closePath(); ctx.fill(); 
  ctx.fillStyle = "#A0522D"; ctx.fillRect(-2, -CHARACTER_VISUAL_HEIGHT.elf + 16, 2, 7); ctx.fillRect(0, -CHARACTER_VISUAL_HEIGHT.elf + 16, 2, 7); 
  ctx.fillStyle = "#FFE4B5"; ctx.fillRect(-4, -CHARACTER_VISUAL_HEIGHT.elf + 5, 2, 7); 
  ctx.beginPath(); ctx.moveTo(2, -CHARACTER_VISUAL_HEIGHT.elf + 5); ctx.lineTo(3, -CHARACTER_VISUAL_HEIGHT.elf + 12); ctx.lineTo(4, -CHARACTER_VISUAL_HEIGHT.elf + 12); ctx.lineTo(3, -CHARACTER_VISUAL_HEIGHT.elf + 5); ctx.fill(); 
  ctx.fillStyle = castEffect ? "yellow" : "#00FFFF"; ctx.beginPath(); ctx.arc(5, -CHARACTER_VISUAL_HEIGHT.elf + 3, castEffect ? 3.5 : 2.5, 0, Math.PI * 2); ctx.fill(); 
  ctx.strokeStyle = "#8B4513"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(5, -CHARACTER_VISUAL_HEIGHT.elf + 5.5); ctx.lineTo(5, -CHARACTER_VISUAL_HEIGHT.elf + 12); ctx.stroke(); 
  if (castEffect && Math.random() < 0.5) { 
    const magicSourceX = entity.x + (entity.direction * 5); 
    const magicSourceY = entity.y - CHARACTER_VISUAL_HEIGHT.elf + 3;                     
    spawnParticle(magicSourceX, magicSourceY, "cyan", 0, "magic_attack"); 
  }
  ctx.restore();
}
function drawUndead(x, y, entity) { 
  if (!ctx) return; ctx.save(); ctx.translate(x, y);
  if (entity.direction === -1) { ctx.scale(-1, 1); }
  const attackLunge = (entity.state === 'attacking' && (Date.now() - entity.lastAttackTime < 200)) ? entity.direction * 3 : 0;
  ctx.fillStyle = "#556B2F"; ctx.fillRect(-2 + attackLunge/2, -CHARACTER_VISUAL_HEIGHT.undead + 4, 4, 11); 
  ctx.strokeStyle = "#405020"; ctx.lineWidth = 0.5;
  for(let r=0; r<3; r++) { ctx.beginPath(); ctx.moveTo(-2, -CHARACTER_VISUAL_HEIGHT.undead + 7 + r*2); ctx.lineTo(2, -CHARACTER_VISUAL_HEIGHT.undead + 7 + r*2); ctx.stroke(); } 
  ctx.fillStyle = "#E0E0E0"; ctx.beginPath(); ctx.arc(0 + attackLunge/2, -CHARACTER_VISUAL_HEIGHT.undead, 3.5, 0, Math.PI * 2); ctx.fill(); 
  ctx.fillStyle = "black"; ctx.beginPath(); ctx.arc(-1.5, -CHARACTER_VISUAL_HEIGHT.undead -0.5, 0.8, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(1.5, -CHARACTER_VISUAL_HEIGHT.undead -0.5, 0.8, 0, Math.PI*2); ctx.fill(); 
  ctx.fillStyle = "#A0A0A0"; ctx.fillRect(-1.5, -CHARACTER_VISUAL_HEIGHT.undead + 15, 1, 7); ctx.fillRect(0.5, -CHARACTER_VISUAL_HEIGHT.undead + 15, 1, 7); 
  ctx.fillRect(-3.5 + attackLunge, -CHARACTER_VISUAL_HEIGHT.undead + 5, 1, 6); ctx.fillRect(2.5 + attackLunge, -CHARACTER_VISUAL_HEIGHT.undead + 5, 1, 6); 
  if (Math.random() < 0.1) { 
    ctx.fillStyle = "rgba(128, 0, 128, 0.7)"; 
    ctx.beginPath(); ctx.arc(-1.5, -CHARACTER_VISUAL_HEIGHT.undead -0.5, 1.2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(1.5, -CHARACTER_VISUAL_HEIGHT.undead -0.5, 1.2, 0, Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

const entities = [];
const maxEntities = 40; 
function spawnEntity() {
  if (!canvas || entities.length >= maxEntities) { return; }
  const types = ["human", "goblin", "dragon", "elf", "undead"];
  const type = types[Math.floor(Math.random() * types.length)];
  let faction, hp, attackDamage, attackRange, color, entitySpeed, dragonColor, wingColor;
  const baseSpeed = Math.random() * 0.5 + 0.2;
  switch(type) {
    case "human": faction = FACTION_ALLIANCE; hp = 100; attackDamage = 10; attackRange = ATTACK_RANGE_MELEE; color = "#aec6cf"; entitySpeed = baseSpeed * 1.1; break;
    case "elf": faction = FACTION_ALLIANCE; hp = 80; attackDamage = 12; attackRange = DETECTION_RADIUS_GROUND / 1.5; color = "#228B22"; entitySpeed = baseSpeed * 1.2; break; 
    case "goblin": faction = FACTION_HORDE; hp = 60; attackDamage = 8; attackRange = ATTACK_RANGE_MELEE; color = "#556B2F"; entitySpeed = baseSpeed * 1.3; break;
    case "undead": faction = FACTION_HORDE; hp = 70; attackDamage = 7; attackRange = ATTACK_RANGE_MELEE; color = "#6c757d"; entitySpeed = baseSpeed * 0.9; break; 
    case "dragon": 
      faction = FACTION_DRAGON; 
      const dragonSubTypes = [
          { c: 'red', colorVal: '#B22222', wingColorVal: '#8B0000', dmg: 20, hpVal: 250 },
          { c: 'blue', colorVal: '#4169E1', wingColorVal: '#00008B', dmg: 18, hpVal: 220 },
          { c: 'green', colorVal: '#2E8B57', wingColorVal: '#006400', dmg: 15, hpVal: 200 }
      ];
      const chosenDragon = dragonSubTypes[Math.floor(Math.random() * dragonSubTypes.length)];
      dragonColor = chosenDragon.colorVal;
      wingColor = chosenDragon.wingColorVal;
      hp = chosenDragon.hpVal; attackDamage = chosenDragon.dmg; attackRange = ATTACK_RANGE_DRAGON_BREATH; 
      color = dragonColor; 
      entitySpeed = baseSpeed * 1.5;
      break; 
    default: faction = FACTION_HORDE; hp = 50; attackDamage = 5; attackRange = ATTACK_RANGE_MELEE; color = "grey"; entitySpeed = baseSpeed;
  }
  const groundLine = W_HEIGHT - 60; 
  let initialX = Math.random() < 0.5 ? -50 - Math.random()*50 : W_WIDTH + 50 + Math.random()*50;
  let initialY;
  if (type === "dragon") { initialY = (W_HEIGHT * 0.15) + Math.random() * (W_HEIGHT * 0.4); } 
  else { initialY = groundLine; } 
  const direction = initialX < W_WIDTH / 2 ? 1 : -1; 
  entities.push({ 
    x: initialX, y: initialY, type, faction, hp, maxHp: hp, attackDamage, attackRange, 
    color, dragonColor, wingColor, direction, initialDirection: direction, 
    speed: entitySpeed, breathingFire: type === "dragon" && Math.random() < 0.45, 
    id: Date.now() + Math.random() * 1000, state: 'moving', 
    target: null, lastAttackTime: 0, deathTimer: 0,
    visualYOffset: type !== 'dragon' ? (CHARACTER_VISUAL_HEIGHT[type] || 20) : 0 
  });
}
function drawEntity(e) {
  if (!ctx) return; 
  if (e.state === 'dying' || e.state === 'dead') return; 
  let drawY = e.y; 
  switch (e.type) {
    case "human": drawHuman(e.x, drawY, e); break;
    case "goblin": drawGoblin(e.x, drawY, e); break;
    case "dragon": drawDragon(e.x, drawY, e); break; 
    case "elf": drawElf(e.x, drawY, e); break;
    case "undead": drawUndead(e.x, drawY, e); break;
  }
  const hpBarY = e.y - (CHARACTER_VISUAL_HEIGHT[e.type] || (e.type === 'dragon' ? 30 * 1.3 : 20)) - 5; 
  if (e.hp < e.maxHp) {
    ctx.fillStyle = 'red'; ctx.fillRect(e.x - 10, hpBarY, 20, 3);
    ctx.fillStyle = 'green'; ctx.fillRect(e.x - 10, hpBarY, (e.hp / e.maxHp) * 20, 3);
  }
}
function getDistance(entity1, entity2) { 
    const y1 = entity1.y - (entity1.type !== 'dragon' ? (CHARACTER_VISUAL_HEIGHT[entity1.type] || 0) / 2 : 0);
    const y2 = entity2.y - (entity2.type !== 'dragon' ? (CHARACTER_VISUAL_HEIGHT[entity2.type] || 0) / 2 : 0);
    const dx = entity1.x - entity2.x; 
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}
function updateEntities() { 
  if (!canvas || !isWarAnimationActive) return; 
  const currentTime = Date.now();
  for (let i = entities.length - 1; i >= 0; i--) {
    const entity = entities[i];
    if (entity.state === 'dead') { entities.splice(i, 1); continue; }
    if (entity.state === 'dying') {
      entity.deathTimer--; if (entity.deathTimer <= 0) { entity.state = 'dead'; }
      continue; 
    }
    if (entity.hp <= 0 && entity.state !== 'dying') {
      entity.state = 'dying'; entity.deathTimer = 60; 
      spawnDeathSplash(entity.x, entity.y - (entity.visualYOffset || 0), entity.color || 'gray'); 
      continue; 
    }
    if (entity.state === 'moving' || (entity.state === 'attacking' && (!entity.target || entity.target.state === 'dying' || entity.target.state === 'dead' || entity.target.hp <= 0))) {
        entity.target = null; 
        let closestEnemy = null;
        let minDistance = (entity.type === 'dragon') ? DETECTION_RADIUS_DRAGON : DETECTION_RADIUS_GROUND;
        for (let j = 0; j < entities.length; j++) {
            if (i === j || entities[j].state === 'dying' || entities[j].state === 'dead' || entities[j].hp <= 0) continue;
            let canTarget = false;
            if (entity.faction === FACTION_DRAGON) {  canTarget = entities[j].faction !== FACTION_DRAGON || entity.id !== entities[j].id;  } 
            else if (entities[j].faction === FACTION_DRAGON) { canTarget = true; } 
            else if (entity.faction !== entities[j].faction) { canTarget = true; }
            if (canTarget) {
                const distance = getDistance(entity, entities[j]);
                if (distance < minDistance) { minDistance = distance; closestEnemy = entities[j];}
            }
        }
        if (closestEnemy) { entity.target = closestEnemy; entity.state = 'attacking'; } 
        else { entity.state = 'moving'; entity.direction = entity.initialDirection; }
    }
    if (entity.state === 'attacking' && entity.target) {
        const distanceToTarget = getDistance(entity, entity.target);
        if (entity.target.x < entity.x) entity.direction = -1; else if (entity.target.x > entity.x) entity.direction = 1;
        let targetActualY = entity.target.y - (entity.target.type !== 'dragon' ? (CHARACTER_VISUAL_HEIGHT[entity.target.type] || 0) / 2 : 0); 
        if (distanceToTarget <= entity.attackRange) { 
            if (currentTime - entity.lastAttackTime > ATTACK_COOLDOWN) {
                entity.target.hp -= entity.attackDamage; entity.lastAttackTime = currentTime;
                spawnParticle(entity.target.x, targetActualY, 'red', 0, 'hit');
            }
        } else { 
            entity.x += entity.speed * entity.direction;
            if (entity.type === 'dragon') {
                let yTargetForDragon = entity.target.type === 'dragon' ? entity.target.y : GROUND_LEVEL_Y - CHARACTER_VISUAL_HEIGHT[entity.target.type] + DRAGON_ATTACK_ALTITUDE_GROUND_TARGET;
                if (Math.abs(entity.y - yTargetForDragon) > entity.speed) {
                    entity.y += (yTargetForDragon > entity.y ? 1 : -1) * entity.speed * 0.7; 
                }
            } 
        }
    } else if (entity.state === 'moving') { 
        entity.x += entity.speed * entity.direction;
        if (entity.type === "dragon") { 
             entity.y += Math.sin(currentTime * 0.0005 * entity.speed + entity.id) * 0.6; 
             if (entity.y < DRAGON_MIN_ALTITUDE) entity.y = DRAGON_MIN_ALTITUDE;
             if (entity.y > W_HEIGHT * 0.6) entity.y = W_HEIGHT * 0.6; 
        }
    }
    if (entity.type !== "dragon") { entity.y = W_HEIGHT - 60; } 
    else { 
        if (entity.y < DRAGON_MIN_ALTITUDE) entity.y = DRAGON_MIN_ALTITUDE;
        if (entity.y > W_HEIGHT - DRAGON_MIN_ALTITUDE - 20) entity.y = W_HEIGHT - DRAGON_MIN_ALTITUDE - 20; 
    }
    drawEntity(entity); 
    if (!entity.target && (entity.x < -200 || entity.x > W_WIDTH + 200) ) { entities.splice(i, 1); }
  }
}

const particles = [];
function spawnParticle(x, y, color, direction = 0, type = "default") { 
  if (!canvas || !isWarAnimationActive) return; 
  let count = 1;
  if (type === 'hit') count = 3 + Math.floor(Math.random() * 3);
  if (type === 'magic_attack') count = 5 + Math.floor(Math.random() * 5);
  if (type === 'fire_breath') count = 2 + Math.floor(Math.random() * 2);
  for (let i = 0; i < count; i++) {
    let life = 50; let dx = (Math.random() - 0.5) * 2; let dy = -Math.random() * 1.5 - 0.5; 
    let size = Math.random() * 1 + 1.5; 
    if (type === "fire" || type === "fire_breath") { 
        dx = (Math.random() * 1 + 0.5) * direction * (type === "fire_breath" ? 2.5 : 1.5) + (Math.random()-0.5)*1; 
        dy = (Math.random() - 0.5) * 1.5 - (type === "fire_breath" ? 0.5: 0.2) ;
        life = 20 + Math.random() * 15; size = Math.random() * (type === "fire_breath" ? 3 : 2.5) + 1.5;
    } else if (type === "magic" || type === "magic_attack") { 
        dx = (Math.random() - 0.5) * (type === "magic_attack" ? 2.2 : 1.2);
        dy = (Math.random() - 0.5) * (type === "magic_attack" ? 2.2 : 1.2);
        life = 30 + Math.random() * 20; size = Math.random() * 1.5 + (type === "magic_attack" ? 1.5 : 1);
    } else if (type === "hit") {
        dx = (Math.random() - 0.5) * 3; dy = (Math.random() - 0.5) * 3;
        life = 10 + Math.random() * 10; size = Math.random() * 1 + 0.5;
    }
    particles.push({ x, y, dx, dy, life, color, size, initialLife: life }); 
  }
}
function spawnDeathSplash(x, y, baseColor) { 
    if (!isWarAnimationActive) return; 
    const numBubbles = 15 + Math.floor(Math.random() * 10); 
    for (let i = 0; i < numBubbles; i++) {
        const angle = Math.random() * Math.PI * 2; const speed = Math.random() * 2 + 1; 
        const life = 30 + Math.floor(Math.random() * 30); const size = Math.random() * 3 + 2; 
        particles.push({
            x: x + (Math.random() - 0.5) * 10, y: y + (Math.random() - 0.5) * 10,
            dx: Math.cos(angle) * speed * 0.5, dy: Math.sin(angle) * speed * 0.5 - Math.random()*0.5, 
            life: life, initialLife: life, color: baseColor, size: size, type: 'bubble' 
        });
    }
}
function drawParticles() { 
  if (!ctx || !isWarAnimationActive) return; 
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]; p.x += p.dx; p.y += p.dy; p.life--; 
    if (p.type === 'bubble') { p.size *= 0.96; p.dy -= 0.02; } 
    else { p.size *= 0.95; }
    if (p.size < 0.3 || p.life <=0) { particles.splice(i,1); continue; }
    ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0, p.size), 0, Math.PI * 2); 
    ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(0, p.life / p.initialLife) * 0.7; 
    ctx.fill(); ctx.globalAlpha = 1; 
  }
}

// --- TERRAIN DRAWING REFACTORED ---
function drawBaseLandscape() {
  if (!ctx || !W_HEIGHT || !W_WIDTH) return;
  // Ground
  ctx.fillStyle = "#2a2a2a"; 
  ctx.fillRect(0, W_HEIGHT - 60, W_WIDTH, 60); 
  // Hills
  hillsData.forEach(hill => { 
    ctx.fillStyle = hill.color; 
    ctx.beginPath(); 
    ctx.moveTo(hill.x, hill.y);
    ctx.quadraticCurveTo(hill.x + hill.width / 2, hill.y - hill.height, hill.x + hill.width, hill.y);
    ctx.closePath(); 
    ctx.fill();
  });
}

function drawWorldStructures() {
  if (!ctx || !W_HEIGHT || !W_WIDTH) return;
  // Huts
  hutsData.forEach(hut => { 
    ctx.fillStyle = hut.color; 
    ctx.fillRect(hut.x, hut.y, hut.width, hut.height); // hut.y is top of hut base
    ctx.beginPath(); 
    ctx.moveTo(hut.x - 3, hut.y); 
    ctx.lineTo(hut.x + hut.width / 2, hut.y - hut.roofHeight); 
    ctx.lineTo(hut.x + hut.width + 3, hut.y); 
    ctx.closePath(); 
    ctx.fill();
    ctx.fillStyle = hut.doorColor; 
    const doorWidth = hut.width / 3; 
    const doorHeight = hut.height * 0.6;
    ctx.fillRect(hut.x + hut.width / 2 - doorWidth / 2, hut.y + hut.height - doorHeight, doorWidth, doorHeight);
  });
  // Campfire rocks (particles are separate)
  campfiresData.forEach(fire => { 
    ctx.fillStyle = fire.rockColor;
    for(let r=0; r<5; r++) {
        const rockX = fire.x + (Math.random() - 0.5) * 10; 
        const rockY = fire.y + (Math.random() - 0.5) * 4 + 2; // fire.y is center for particles
        const rockSize = Math.random() * 2 + 2; 
        ctx.beginPath(); 
        ctx.arc(rockX, rockY, rockSize, 0, Math.PI * 2); 
        ctx.fill();
    }
  });
}

function updateActiveCampfireEffects() {
  if (!ctx || !isWarAnimationActive) return; // Only spawn if war is active
  campfiresData.forEach(fire => {
    if (fire.isActive && Math.random() < 0.7) { 
        spawnParticle(fire.x, fire.y - 2, "orange", 0, "fire");
        spawnParticle(fire.x + (Math.random()*2-1), fire.y - 3, "yellow", 0, "fire");
        if(Math.random() < 0.3) spawnParticle(fire.x + (Math.random()*2-1), fire.y - 4, "#FF4500", 0, "fire"); 
    }
  });
}


let lastSpawnTime = 0;
const spawnInterval = 1200; 
let lastFrameTime = 0; 
let frameCount = 0; 

function drawPausedState() {
    if (ctx && canvas) {
        ctx.fillStyle = "rgba(10, 10, 25, 0.95)"; 
        ctx.fillRect(0, 0, W_WIDTH, W_HEIGHT); 
        drawBaseLandscape(); // ONLY draw ground and hills
    }
}

function animate(timestamp) {
  animationFrameId = requestAnimationFrame(animate); 
  
  if (!isWarAnimationActive) { 
    drawPausedState(); 
    return; 
  }

  frameCount++;
  // if (frameCount % 120 === 0) { console.log(`Animating frame: ${frameCount}, Entities: ${entities.length}`); }
  if (!ctx || !canvas) { console.error("warBackground.js: Context or Canvas not available in animate loop."); return; }
  
  // Draw Sky
  ctx.fillStyle = "rgba(10, 10, 25, 0.95)"; 
  ctx.fillRect(0, 0, W_WIDTH, W_HEIGHT);
  
  // Draw Terrain Layers
  drawBaseLandscape();
  drawWorldStructures(); // Huts and campfire rocks
  updateActiveCampfireEffects(); // Particles for campfires

  updateEntities(); 
  drawParticles();

  if (timestamp - lastSpawnTime > spawnInterval) {
    if (Math.random() < 0.65) { spawnEntity(); }
    lastSpawnTime = timestamp; 
  }
}

function toggleAnimation() {
    isWarAnimationActive = !isWarAnimationActive;
    if (isWarAnimationActive) {
        if (toggleWarBtn) { toggleWarBtn.textContent = "Deactivate War"; toggleWarBtn.classList.remove('deactivated'); }
        lastFrameTime = performance.now(); 
        lastSpawnTime = performance.now() - spawnInterval -1; 
        entities.length = 0; 
        particles.length = 0;
        // initializeTerrain(); // Already handled by resize and initial load
    } else {
        if (toggleWarBtn) { toggleWarBtn.textContent = "Activate War"; toggleWarBtn.classList.add('deactivated'); }
        // The drawPausedState in animate() will handle clearing moving elements
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    if (canvas && ctx) {
        if (toggleWarBtn) { 
            if (isWarAnimationActive) { toggleWarBtn.textContent = "Deactivate War"; toggleWarBtn.classList.remove('deactivated'); } 
            else { toggleWarBtn.textContent = "Activate War"; toggleWarBtn.classList.add('deactivated'); }
            toggleWarBtn.addEventListener('click', toggleAnimation);
        } else { console.error("warBackground.js: Toggle button not found!"); }
        
        resizeCanvas(); // Initial setup of dimensions and terrain
        lastFrameTime = performance.now(); 
        lastSpawnTime = performance.now() - spawnInterval -1; 
        
        animationFrameId = requestAnimationFrame(animate); 
    } else { 
        console.error("warBackground.js: Canvas or context not found. Animation NOT started."); 
    }
});