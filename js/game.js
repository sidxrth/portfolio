import { playClickSound, playJumpSound } from './utils.js';
import { hideLampPopup } from './ui.js';

// =========================================
// GAME VARIABLES & DOM ELEMENTS
// =========================================
const startButton = document.getElementById('startGameButton');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const preGameOverlay = document.getElementById('preGameOverlay');
const chickenImageElement = document.getElementById('chickenImageElement'); 
const crashImageElement = document.getElementById('crashImage'); 

// Overlay Control Elements
const gameOverlay = document.getElementById('gameOverlay');
const openGameTrigger = document.getElementById('openGameTrigger');
const closeGameButton = document.getElementById('closeGameButton');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const retryButton = document.getElementById('retryButton');
const finalScoreSpan = document.getElementById('finalScore');

// Obstacle Images
const obstacleImages = [
    document.getElementById('obs1Image'),
    document.getElementById('obs2Image'),
    document.getElementById('obs3Image'),
    document.getElementById('obs4Image')
];

let dino, obstacles, score, gameSpeed, animationFrameId;
let spawnTimer = 0; 
let gameRunning = false;
let highScore = localStorage.getItem('portfolioGameHighScore') || 0;
let runFrame = 0;      
let gameParticles = []; 
let stars = [];        

// Game constants
const GROUND_LINE_OFFSET = 20;
const CANVAS_HEIGHT = 300;
const CHICKEN_SIZE = 40;
const OBSTACLE_BASE_WIDTH = 45; 
const OBSTACLE_BASE_HEIGHT = 45; 

// Physics & Gameplay Tuning
const GAME_PHYSICS = {
    gravity: 0.6,          
    jumpPower: -12,        
    speedStart: 7.0,       
    speedMax: 20,
    speedIncrement: 0.005  
};

// Initialize Stars for Background
function initStars() {
    stars = [];
    for(let i=0; i<50; i++) {
        stars.push({
            x: Math.random() * 1200,
            y: Math.random() * 300,
            size: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.1
        });
    }
}

// Event Listeners for Game
if (startButton) startButton.addEventListener('click', startGame);
if (retryButton) retryButton.addEventListener('click', startGame);
if (openGameTrigger) openGameTrigger.addEventListener('click', openGameOverlay);
if (closeGameButton) closeGameButton.addEventListener('click', closeGameOverlay);

// Handle Input (Keyboard & Touch)
function handleInput(e) {
    if (gameOverlay && !gameOverlay.classList.contains('hidden')) {
        if (e.type === 'touchstart' || e.code === 'Space') {
             // e.preventDefault(); 
        }
        if (!gameRunning) startGame(); 
        else jump();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') handleInput(e);
});

if (canvas) {
    canvas.addEventListener('touchstart', handleInput, {passive: false});
    canvas.addEventListener('mousedown', (e) => {
        if(e.target.tagName !== 'BUTTON') handleInput(e);
    });
}

export function openGameOverlay() {
    if (!gameOverlay) return;
    gameOverlay.classList.remove('hidden');
    resizeCanvas();
    gameRunning = false;
    if (preGameOverlay) preGameOverlay.classList.remove('hidden');
    if (gameOverOverlay) gameOverOverlay.classList.add('hidden');
    
    initStars();
    drawBackground(); 
    drawGround();
    drawDino(false);
    
    hideLampPopup();
}

export function closeGameOverlay() {
    if (!gameOverlay) return;
    gameOverlay.classList.add('hidden');
    gameRunning = false; 
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
}

function resizeCanvas() {
    const gameContainer = document.getElementById('gameContainer');
    if (gameContainer && canvas) { 
        canvas.width = gameContainer.offsetWidth; 
        canvas.height = CANVAS_HEIGHT; 
        if (dino) dino.y = CANVAS_HEIGHT - GROUND_LINE_OFFSET - dino.height; 
    }
}
window.addEventListener('resize', resizeCanvas);

function startGame() {
    if (gameRunning) return;
    if (preGameOverlay) preGameOverlay.classList.add('hidden');
    if (gameOverOverlay) gameOverOverlay.classList.add('hidden');
    gameRunning = true;
    resizeCanvas();
    resetGame();
    update(); 
    playClickSound();
}

function resetGame() {
    dino = { 
        x: 50, 
        y: CANVAS_HEIGHT - GROUND_LINE_OFFSET - CHICKEN_SIZE, 
        width: CHICKEN_SIZE, 
        height: CHICKEN_SIZE, 
        dy: 0, 
        jumpPower: GAME_PHYSICS.jumpPower,  
        gravity: GAME_PHYSICS.gravity,      
        isJumping: false,
        rotation: 0
    };
    
    obstacles = []; 
    gameParticles = [];
    score = 0; 
    gameSpeed = GAME_PHYSICS.speedStart; 
    spawnTimer = 0;  
    
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
}

function jump() { 
    if (dino && !dino.isJumping) { 
        dino.dy = dino.jumpPower; 
        dino.isJumping = true; 
        for(let i=0; i<5; i++) {
            gameParticles.push(createParticle(dino.x + 10, dino.y + dino.height));
        }
        playJumpSound(); 
    } 
}

function createParticle(x, y) {
    return {
        x: x, 
        y: y,
        vx: -gameSpeed * 0.5 - Math.random() * 2,
        vy: -Math.random() * 2,
        life: 1.0,
        size: Math.random() * 3 + 1
    };
}

function createObstacle() {
    if (!canvas) return;
    const randomIndex = Math.floor(Math.random() * obstacleImages.length);
    const selectedImage = obstacleImages[randomIndex];
    
    let scale = 0.9 + Math.random() * 0.4; 
    let obsWidth = OBSTACLE_BASE_WIDTH * scale; 
    let obsHeight = OBSTACLE_BASE_HEIGHT * scale;
    if (randomIndex === 2) obsHeight *= 1.2; 
    
    let obs = { 
        x: canvas.width, 
        width: obsWidth, 
        height: obsHeight, 
        y: CANVAS_HEIGHT - GROUND_LINE_OFFSET - obsHeight, 
        image: selectedImage 
    };
    obstacles.push(obs);
}

function drawBackground() {
    if (!ctx) return;
    let grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    grad.addColorStop(0, '#0a0a1a');
    grad.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI*2);
        ctx.fill();
        if (gameRunning) {
            star.x -= star.speed * (gameSpeed * 0.1); 
            if (star.x < 0) star.x = canvas.width;
        }
    });
}

function drawDino(isCrashed = false) {
    if (!ctx || !dino) return;
    ctx.save();
    
    let bounce = 0;
    let rotation = 0;
    
    if (!dino.isJumping && !isCrashed) {
        runFrame++;
        bounce = Math.sin(runFrame * 0.2) * 3; 
        rotation = Math.sin(runFrame * 0.1) * 5 * (Math.PI/180); 
    } else if (dino.isJumping) {
        rotation = (dino.dy < 0 ? -15 : 15) * (Math.PI/180);
    }

    ctx.translate(dino.x + dino.width/2, dino.y + dino.height/2 + bounce);
    ctx.rotate(rotation);
    ctx.scale(-1, 1); 

    if (chickenImageElement && chickenImageElement.complete) {
        if (isCrashed && crashImageElement && crashImageElement.complete) {
            ctx.scale(-1, 1); 
            ctx.rotate(-rotation);
            ctx.translate(-(dino.x + dino.width/2), -(dino.y + dino.height/2 + bounce));
            ctx.drawImage(chickenImageElement, dino.x, dino.y + bounce, dino.width, dino.height);
            ctx.drawImage(crashImageElement, dino.x + 10, dino.y - 20, 40, 40);
        } else {
            ctx.drawImage(chickenImageElement, -dino.width/2, -dino.height/2, dino.width, dino.height);
        }
    } else { 
        ctx.fillStyle = '#fff'; 
        ctx.fillRect(-dino.width/2, -dino.height/2, dino.width, dino.height); 
    }
    ctx.restore();
}

function drawObstacle(obs) { 
    if (!ctx) return; 
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 5;

    if (obs.image && obs.image.complete) {
        ctx.drawImage(obs.image, obs.x, obs.y, obs.width, obs.height); 
    } else { 
        ctx.fillStyle = '#ff6b6b'; 
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height); 
    }
    ctx.restore();
}

function drawScore() { 
    if (!ctx || !canvas) return; 
    
    ctx.fillStyle = '#ffffff'; 
    ctx.font = 'bold 20px "Courier New", monospace'; 
    ctx.textAlign = 'right'; 
    ctx.fillText(`SCORE: ${Math.floor(score).toString().padStart(5, '0')}`, canvas.width - 20, 30);
    
    ctx.fillStyle = '#aaaaaa';
    ctx.font = 'bold 16px "Courier New", monospace'; 
    ctx.fillText(`HI: ${Math.floor(highScore).toString().padStart(5, '0')}`, canvas.width - 20, 50);
}

function drawGround() { 
    if (!ctx || !canvas) return; 
    ctx.beginPath(); 
    ctx.moveTo(0, CANVAS_HEIGHT - GROUND_LINE_OFFSET); 
    ctx.lineTo(canvas.width, CANVAS_HEIGHT - GROUND_LINE_OFFSET); 
    ctx.strokeStyle = '#666'; 
    ctx.lineWidth = 2; 
    ctx.stroke(); 
    
    ctx.fillStyle = '#444';
    let offset = (score * 10) % 50;
    for(let i=0; i<canvas.width; i+=50) {
        ctx.fillRect(i - offset, CANVAS_HEIGHT - GROUND_LINE_OFFSET + 5, 20, 2);
    }
}

function drawParticles() {
    for (let i = gameParticles.length - 1; i >= 0; i--) {
        let p = gameParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        if (p.life <= 0) {
            gameParticles.splice(i, 1);
        } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${p.life * 0.5})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function update() {
    if (!gameRunning || !ctx || !canvas) return;
    
    drawBackground(); 
    drawGround();
    
    if (gameSpeed < GAME_PHYSICS.speedMax) {
        gameSpeed += GAME_PHYSICS.speedIncrement;
    }
    
    dino.dy += dino.gravity; 
    dino.y += dino.dy;
    
    const groundY = CANVAS_HEIGHT - GROUND_LINE_OFFSET - dino.height; 
    if (dino.y > groundY) { 
        dino.y = groundY; 
        dino.dy = 0; 
        if (dino.isJumping) {
             for(let i=0; i<3; i++) gameParticles.push(createParticle(dino.x + 20, dino.y + dino.height));
        }
        dino.isJumping = false; 
        if (Math.random() < 0.2) {
             gameParticles.push(createParticle(dino.x + 10, dino.y + dino.height));
        }
    }
    
    drawParticles();
    drawDino(false);
    drawScore();

    spawnTimer++;
    let minGapFrames = (60 + Math.random() * 40) * (6 / gameSpeed); 
    
    if (spawnTimer > minGapFrames) {
        createObstacle();
        spawnTimer = 0; 
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i]; 
        obs.x -= gameSpeed; 
        drawObstacle(obs);
        
        const padding = 10;
        if (
            dino.x + padding < obs.x + obs.width - padding && 
            dino.x + dino.width - padding > obs.x + padding && 
            dino.y + padding < obs.y + obs.height && 
            dino.y + dino.height > obs.y + padding
        ) {
            handleGameOver();
            return; 
        }

        if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
        }
    }
    
    score += 0.15; 
    animationFrameId = requestAnimationFrame(update);
}

function handleGameOver() {
    gameRunning = false; 
    cancelAnimationFrame(animationFrameId);
    
    ctx.save();
    ctx.translate(Math.random()*10 - 5, Math.random()*10 - 5);
    drawBackground();
    drawGround();
    obstacles.forEach(drawObstacle);
    drawDino(true);
    ctx.restore();
    
    if (score > highScore) {
        highScore = Math.floor(score);
        localStorage.setItem('portfolioGameHighScore', highScore);
    }

    if (finalScoreSpan) finalScoreSpan.textContent = Math.floor(score);
    if (gameOverOverlay) gameOverOverlay.classList.remove('hidden');
}