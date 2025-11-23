// =========================================
// 1. GAME VARIABLES & DOM ELEMENTS
// =========================================
const startButton = document.getElementById('startGameButton');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const preGameOverlay = document.getElementById('preGameOverlay');
const clickHereText = document.getElementById('clickHereText');
const chickenImageElement = document.getElementById('chickenImageElement'); 
const crashImageElement = document.getElementById('crashImage'); 

// Overlay Control Elements
const gameOverlay = document.getElementById('gameOverlay');
const openGameTrigger = document.getElementById('openGameTrigger');
const closeGameButton = document.getElementById('closeGameButton');

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

const GROUND_LINE_OFFSET = 20;
const CANVAS_HEIGHT = 300;
const CHICKEN_SIZE = 40;
const CRASH_ICON_SIZE = 30; 
const OBSTACLE_BASE_WIDTH = 45; 
const OBSTACLE_BASE_HEIGHT = 45; 


// =========================================
// 2. PROJECT MODAL & GALLERY
// =========================================
const projectModal = document.getElementById('projectModal');
const closeModalButton = document.getElementById('closeModalButton');
const projectItems = document.querySelectorAll('.project-item'); 
const modalImage = document.getElementById('modalImage');
const prevImageButton = document.getElementById('prevImage');
const nextImageButton = document.getElementById('nextImage');
const modalProjectName = document.getElementById('modalProjectName');
const modalProjectTech = document.getElementById('modalProjectTech');
const modalProjectDesc = document.getElementById('modalProjectDesc');
const modalProjectLink = document.getElementById('modalProjectLink');

let currentProjectData = null;
let currentImageIndex = 0;

// --- UPDATED PROJECTS DATA FROM RESUME ---
const projectsData = {
    '1': {
        name: 'AI-Assisted Proctored Exam System',
        desc: 'Built two Electron-based desktop applications (student client + teacher app) with real-time Firebase synchronization. Integrated AI-driven continuous proctoring using a face detection model to flag malpractice, reducing manual workload by ~90%. Features automated grading with Gemini AI and a secure SQLite3-based authentication system.',
        tech: 'Tech: Electron, Gemini AI, Firebase, SQLite3',
        link: 'https://github.com/sidxrth', 
        images: [
            { id: 'project1_img1', src: 'assets/project1/image1.png' },
            { id: 'project1_img2', src: 'assets/project1/image2.png' }
        ]
    },
    '2': {
        name: 'Smart Waste Management System',
        desc: 'A Flutter frontend integrated with Firestore for role-based access, real-time sync, and auto-pricing. Implemented GPS-based scheduling and reward computation, significantly improving pickup accuracy and user submission efficiency.',
        tech: 'Tech: Flutter, Firebase',
        link: 'https://github.com/sidxrth', 
        images: [
            { id: 'project2_img1', src: 'assets/project2/image1.png' }
        ]
    },
    '3': {
        name: 'Cloud-Hosted Blog Management Platform',
        desc: 'Built a Node.js backend with AWS RDS and deployed it on EC2 with ELB, S3, and VPC. Achieved 99.9% uptime using a load-balanced architecture with multi-AZ RDS, ensuring a reliable and scalable cloud setup.',
        tech: 'Tech: AWS (EC2, RDS, ELB, S3), Node.js',
        link: 'https://github.com/sidxrth', 
        images: [
            { id: 'project3_img1', src: 'assets/project3/image1.png' },
            { id: 'project3_img2', src: 'assets/project3/image2.png' }
        ]
    }
};

function updateImageDisplay() {
    if (!currentProjectData || currentProjectData.images.length === 0) return;
    modalImage.classList.remove('show');
    setTimeout(() => {
        const imageSrc = currentProjectData.images[currentImageIndex].src;
        const imageElement = document.getElementById(currentProjectData.images[currentImageIndex].id);
        if (imageElement) { modalImage.src = imageElement.src; } else { modalImage.src = imageSrc; }
        const hasMultipleImages = currentProjectData.images.length > 1;
        if (prevImageButton) prevImageButton.style.display = hasMultipleImages ? 'block' : 'none';
        if (nextImageButton) nextImageButton.style.display = hasMultipleImages ? 'block' : 'none';
        setTimeout(() => { modalImage.classList.add('show'); }, 10);
    }, 300);
}

function openProjectModal(projectId) {
    currentProjectData = projectsData[projectId];
    currentImageIndex = 0;
    if (!currentProjectData) return;
    modalProjectName.textContent = currentProjectData.name;
    modalProjectTech.textContent = currentProjectData.tech;
    modalProjectDesc.textContent = currentProjectData.desc;
    modalProjectLink.href = currentProjectData.link;
    modalProjectLink.style.display = currentProjectData.link ? 'inline-block' : 'none';
    updateImageDisplay();
    projectModal.classList.add('visible');
    document.body.style.overflow = 'hidden'; 
}

function closeProjectModal() {
    projectModal.classList.remove('visible');
    document.body.style.overflow = ''; 
    currentProjectData = null;
    currentImageIndex = 0;
}

function showNextImage() {
    if (!currentProjectData || currentProjectData.images.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % currentProjectData.images.length;
    updateImageDisplay();
}

function showPrevImage() {
    if (!currentProjectData || currentProjectData.images.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + currentProjectData.images.length) % currentProjectData.images.length;
    updateImageDisplay();
}

if (projectItems) {
    projectItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
            const projectId = item.getAttribute('data-project-id');
            openProjectModal(projectId);
        });
        
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10; 
            const rotateY = ((x - centerX) / centerX) * 10;
            item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        item.addEventListener('mouseleave', () => {
            if (item.classList.contains('show-item')) {
                 item.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
            } else {
                 item.style.transform = ''; 
            }
        });
    });
}

if (closeModalButton) closeModalButton.addEventListener('click', closeProjectModal);
if (prevImageButton) prevImageButton.addEventListener('click', showPrevImage);
if (nextImageButton) nextImageButton.addEventListener('click', showNextImage);

if (projectModal) {
    projectModal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) closeProjectModal();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (projectModal && projectModal.classList.contains('visible')) closeProjectModal();
        if (gameOverlay && !gameOverlay.classList.contains('hidden')) closeGameOverlay();
    }
});


// =========================================
// 3. GAME LOGIC (OPTIMIZED & DEBUGGED)
// =========================================
if (startButton) startButton.addEventListener('click', startGame);
if (canvas) canvas.addEventListener('click', jump);
if (openGameTrigger) openGameTrigger.addEventListener('click', openGameOverlay);
if (closeGameButton) closeGameButton.addEventListener('click', closeGameOverlay);
if (preGameOverlay) preGameOverlay.addEventListener('click', (e) => { 
    if (!gameRunning) startGame(); 
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameOverlay && !gameOverlay.classList.contains('hidden')) {
        e.preventDefault(); 
        if (!gameRunning) startGame(); 
        else jump();
    }
});

function openGameOverlay() {
    if (!gameOverlay) return;
    gameOverlay.classList.remove('hidden');
    resizeCanvas();
    if (!gameRunning && preGameOverlay && preGameOverlay.style.display !== 'flex') {
        resetGame();
        preGameOverlay.style.display = 'flex';
        if(canvas) canvas.style.display = 'none';
    }
}

function closeGameOverlay() {
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
    if (preGameOverlay) preGameOverlay.style.display = 'none';
    if (canvas) canvas.style.display = 'block';
    
    gameRunning = true;
    resizeCanvas();
    if (clickHereText) clickHereText.textContent = 'CLICK HERE / PRESS SPACE'; 
    
    resetGame();
    update(); 
}

function resetGame() {
    dino = { 
        x: 50, 
        y: CANVAS_HEIGHT - GROUND_LINE_OFFSET - CHICKEN_SIZE, 
        width: CHICKEN_SIZE, 
        height: CHICKEN_SIZE, 
        dy: 0, 
        jumpPower: -12.5,  
        gravity: 0.7,      
        isJumping: false, 
        color: '#e0e0e0' 
    };
    
    obstacles = []; 
    score = 0; 
    gameSpeed = 5.0; 
    spawnTimer = 0;  
    
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
}

function jump() { 
    if (dino && !dino.isJumping) { 
        dino.dy = dino.jumpPower; 
        dino.isJumping = true; 
    } 
}

function createObstacle() {
    if (!canvas) return;
    const randomIndex = Math.floor(Math.random() * obstacleImages.length);
    const selectedImage = obstacleImages[randomIndex];
    
    let obsWidth = OBSTACLE_BASE_WIDTH; 
    let obsHeight = OBSTACLE_BASE_HEIGHT;
    
    if (randomIndex === 2) obsHeight = OBSTACLE_BASE_HEIGHT * 1.4; 
    else if (randomIndex === 3) obsWidth = OBSTACLE_BASE_WIDTH * 1.3; 
    
    let obs = { 
        x: canvas.width, 
        width: obsWidth, 
        height: obsHeight, 
        y: CANVAS_HEIGHT - GROUND_LINE_OFFSET - obsHeight, 
        image: selectedImage 
    };
    
    obstacles.push(obs);
}

function drawDino(isCrashed = false) {
    if (!ctx || !dino) return;
    if (chickenImageElement && chickenImageElement.complete) {
        ctx.save();
        if (isCrashed) {
            if (crashImageElement && crashImageElement.complete) {
                ctx.drawImage(crashImageElement, dino.x + dino.width/2 - 15, dino.y - 30, 30, 30);
            }
            ctx.drawImage(chickenImageElement, dino.x, dino.y, dino.width, dino.height);
        } else {
            ctx.translate(dino.x + dino.width, dino.y); 
            ctx.scale(-1, 1); 
            ctx.drawImage(chickenImageElement, 0, 0, dino.width, dino.height); 
        }
        ctx.restore();
    } else { 
        ctx.fillStyle = dino.color; 
        ctx.fillRect(dino.x, dino.y, dino.width, dino.height); 
    }
}

function drawObstacle(obs) { 
    if (!ctx) return; 
    if (obs.image && obs.image.complete) {
        ctx.drawImage(obs.image, obs.x, obs.y, obs.width, obs.height); 
    } else { 
        ctx.fillStyle = 'red'; 
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height); 
    }
}

function drawScore() { 
    if (!ctx || !canvas) return; 
    ctx.fillStyle = '#e0e0e0'; 
    ctx.font = 'bold 20px Poppins'; 
    ctx.textAlign = 'right'; 
    ctx.fillText('SCORE: ' + Math.floor(score), canvas.width - 20, 30); 
}

function drawGround() { 
    if (!ctx || !canvas) return; 
    ctx.beginPath(); 
    ctx.moveTo(0, CANVAS_HEIGHT - GROUND_LINE_OFFSET); 
    ctx.lineTo(canvas.width, CANVAS_HEIGHT - GROUND_LINE_OFFSET); 
    ctx.strokeStyle = '#555'; 
    ctx.lineWidth = 2; 
    ctx.stroke(); 
    ctx.closePath(); 
}

function update() {
    if (!gameRunning || !ctx || !canvas) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameSpeed < 12) {
        gameSpeed += 0.0015;
    }
    
    drawGround(); 
    drawScore();
    
    dino.dy += dino.gravity; 
    dino.y += dino.dy;
    
    const groundY = CANVAS_HEIGHT - GROUND_LINE_OFFSET - dino.height; 
    if (dino.y > groundY) { 
        dino.y = groundY; 
        dino.dy = 0; 
        dino.isJumping = false; 
    }
    drawDino(false);

    spawnTimer++;
    let minGapFrames = 60; 
    
    if (spawnTimer > minGapFrames && Math.random() < 0.005 * gameSpeed) {
        createObstacle();
        spawnTimer = 0; 
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i]; 
        obs.x -= gameSpeed; 
        drawObstacle(obs);
        
        const hitboxPaddingX = 8;
        const hitboxPaddingY = 5;
        
        if (
            dino.x + hitboxPaddingX < obs.x + obs.width - hitboxPaddingX && 
            dino.x + dino.width - hitboxPaddingX > obs.x + hitboxPaddingX && 
            dino.y + hitboxPaddingY < obs.y + obs.height && 
            dino.y + dino.height > obs.y + hitboxPaddingY
        ) {
            handleGameOver();
            return; 
        }

        if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
        }
    }
    
    score += 0.1; 
    animationFrameId = requestAnimationFrame(update);
}

function handleGameOver() {
    gameRunning = false; 
    cancelAnimationFrame(animationFrameId);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    drawGround(); 
    drawScore(); 
    obstacles.forEach(drawObstacle); 
    drawDino(true); 
    
    ctx.fillStyle = '#ff4444'; 
    ctx.font = 'bold 40px Poppins'; 
    ctx.textAlign = 'center'; 
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    
    ctx.fillStyle = '#fff';
    ctx.font = '20px Poppins';
    ctx.fillText('Press Space to Restart', canvas.width / 2, canvas.height / 2 + 40);

    if (preGameOverlay) { 
        preGameOverlay.style.display = 'flex'; 
        if (clickHereText) clickHereText.textContent = 'RESTART / PRESS SPACE'; 
    }
}


// =========================================
// 4. TYPING EFFECT
// =========================================
// --- UPDATED ROLES FROM RESUME ---
const roles = ["Software Engineer", "Full Stack Developer", "Cloud Architect", "AI Engineer"];
let roleIndex = 0; let charIndex = 0; let isDeleting = false;
const typingSpeed = 100; const erasingSpeed = 50; const delayBetweenRoles = 2000;
const typingTextElement = document.querySelector('.typing-text');

function typeEffect() {
    if (!typingTextElement) return;
    const currentRole = roles[roleIndex];
    if (isDeleting) { typingTextElement.textContent = currentRole.substring(0, charIndex - 1); charIndex--; } 
    else { typingTextElement.textContent = currentRole.substring(0, charIndex + 1); charIndex++; }
    let nextSpeed = isDeleting ? erasingSpeed : typingSpeed;
    if (!isDeleting && charIndex === currentRole.length) { nextSpeed = delayBetweenRoles; isDeleting = true; } 
    else if (isDeleting && charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; }
    setTimeout(typeEffect, nextSpeed);
}
document.addEventListener('DOMContentLoaded', typeEffect);


// =========================================
// 5. REPEATABLE SCROLL OBSERVER
// =========================================
const observerOptions = { 
    root: null, 
    threshold: 0.15, 
    rootMargin: "0px" 
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('blur-hidden')) entry.target.classList.add('show-section');
            if (entry.target.classList.contains('skill-item')) entry.target.classList.add('show-item');
            if (entry.target.classList.contains('project-item')) entry.target.classList.add('show-item');
        } else {
            if (entry.target.classList.contains('blur-hidden')) entry.target.classList.remove('show-section');
            if (entry.target.classList.contains('skill-item')) entry.target.classList.remove('show-item');
            if (entry.target.classList.contains('project-item')) entry.target.classList.remove('show-item');
        }
    });
}, observerOptions);

const hiddenSections = document.querySelectorAll('.blur-hidden');
const skillItems = document.querySelectorAll('.skill-item');

hiddenSections.forEach(el => observer.observe(el));
skillItems.forEach(el => observer.observe(el));
if (projectItems) projectItems.forEach(el => observer.observe(el));


// =========================================
// 6. ANALOG CLOCK & QUOTES (New)
// =========================================
function initClockAndQuotes() {
    const clockFace = document.getElementById('clockFace');
    const hourHand = document.querySelector('.hour-hand');
    const minHand = document.querySelector('.min-hand');
    const secondHand = document.querySelector('.second-hand');
    const quoteElement = document.getElementById('timeQuote');

    if (!clockFace) return;

    // Generate Clock Ticks
    for (let i = 0; i < 60; i++) {
        const mark = document.createElement('div');
        mark.classList.add('clock-mark');
        if (i % 5 === 0) { mark.classList.add('major'); }
        // Radius 150px (for 300px clock). Origin 148px.
        mark.style.transformOrigin = "50% 148px"; 
        mark.style.transform = `translateX(-50%) rotate(${i * 6}deg)`;
        clockFace.appendChild(mark);
    }

    function updateClock() {
        const now = new Date();
        const seconds = now.getSeconds();
        const milliseconds = now.getMilliseconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();

        const secondsDegrees = ((seconds + (milliseconds / 1000)) / 60) * 360;
        const minutesDegrees = ((minutes + seconds / 60) / 60) * 360;
        const hoursDegrees = ((hours + minutes / 60) / 12) * 360;

        secondHand.style.transform = `translateX(-50%) rotate(${secondsDegrees}deg)`;
        minHand.style.transform = `translateX(-50%) rotate(${minutesDegrees}deg)`;
        hourHand.style.transform = `translateX(-50%) rotate(${hoursDegrees}deg)`;

        requestAnimationFrame(updateClock);
    }

    // Quote Cycler
    const quotes = [
        "Time is the most valuable thing a man can spend.",
        "Lost time is never found again.",
        "The two most powerful warriors are patience and time.",
        "Time flies over us, but leaves its shadow behind.",
        "Time is a created thing. To say 'I don't have time,' is like saying, 'I don't want to'.",
        "Your time is limited, so don't waste it living someone else's life."
    ];
    
    let quoteIndex = 0;
    
    function cycleQuotes() {
        if(!quoteElement) return;
        quoteElement.style.opacity = 0;
        
        setTimeout(() => {
            quoteIndex = (quoteIndex + 1) % quotes.length;
            quoteElement.textContent = `"${quotes[quoteIndex]}"`;
            quoteElement.style.opacity = 0.8;
        }, 1000); // Wait for fade out
    }
    
    // Change quote every 6 seconds
    setInterval(cycleQuotes, 6000);

    requestAnimationFrame(updateClock);
}

document.addEventListener('DOMContentLoaded', initClockAndQuotes);