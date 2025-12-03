// =========================================
// TYPING EFFECT
// =========================================
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


// =========================================
// REPEATABLE SCROLL OBSERVER
// =========================================
const observerOptions = { root: null, threshold: 0.15, rootMargin: "0px" };
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
const projectItems = document.querySelectorAll('.project-item');
hiddenSections.forEach(el => observer.observe(el));
skillItems.forEach(el => observer.observe(el));
if (projectItems) projectItems.forEach(el => observer.observe(el));


// =========================================
// ANALOG CLOCK & QUOTES
// =========================================
function initClockAndQuotes() {
    const clockFace = document.getElementById('clockFace');
    const hourHand = document.querySelector('.hour-hand');
    const minHand = document.querySelector('.min-hand');
    const secondHand = document.querySelector('.second-hand');
    const quoteElement = document.getElementById('timeQuote');

    if (!clockFace) return;

    for (let i = 0; i < 60; i++) {
        const mark = document.createElement('div');
        mark.classList.add('clock-mark');
        if (i % 5 === 0) { mark.classList.add('major'); }
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
        }, 1000); 
    }
    
    setInterval(cycleQuotes, 6000);
    requestAnimationFrame(updateClock);
}


// =========================================
// CONSTELLATION MOUSE TRAIL
// =========================================
function initConstellation() {
    const canvas = document.getElementById('constellationCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 60; 
    let mouse = { x: null, y: null };
    let animationFrameId;
    let isAnimating = false;

    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    
    const heroSection = document.getElementById('home');
    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(heroSection);
    resize();

    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    heroSection.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.size = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(0, 174, 239, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    function animate() {
        if (!isAnimating) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        animationFrameId = requestAnimationFrame(animate);
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    ctx.strokeStyle = `rgba(0, 174, 239, ${1 - distance/100})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
            if (mouse.x != null) {
                let dx = particles[a].x - mouse.x;
                let dy = particles[a].y - mouse.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                     ctx.strokeStyle = `rgba(0, 174, 239, ${1 - distance/150})`;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!isAnimating) {
                    isAnimating = true;
                    animate();
                }
            } else {
                isAnimating = false;
                cancelAnimationFrame(animationFrameId);
            }
        });
    }, { threshold: 0 });

    observer.observe(heroSection);
}


// =========================================
// REUSABLE PARTICLE EFFECTS
// =========================================
function initSectionParticles(sectionId, particleColor = 'rgba(255, 255, 255, 0.5)', maxDistance = 120, particleCount = 40, sizeRange = { min: 0.5, max: 2.5 }) {
    const section = document.getElementById(sectionId);
    const canvas = document.getElementById(`${sectionId}Canvas`); 
    if (!canvas || !section) return;
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    let mouse = { x: null, y: null };
    let animationFrameId;
    let isAnimating = false;

    function resize() {
        canvas.width = section.offsetWidth;
        canvas.height = section.offsetHeight;
    }
    
    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(section);
    resize();

    section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    section.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class SparkleParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 1.0; 
            this.vy = (Math.random() - 0.5) * 1.0;
            this.size = Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min;
            this.maxSize = this.size + 1.5;
            this.growing = true;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            if (this.growing) {
                this.size += 0.02;
                if (this.size >= this.maxSize) this.growing = false;
            } else {
                this.size -= 0.02;
                if (this.size <= sizeRange.min) this.growing = true;
            }
        }

        draw() {
            ctx.fillStyle = particleColor.replace('0.5', this.opacity.toFixed(2));
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new SparkleParticle());

    function animate() {
        if (!isAnimating) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        
        animationFrameId = requestAnimationFrame(animate); 
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            if (mouse.x != null) {
                let dx = particles[a].x - mouse.x;
                let dy = particles[a].y - mouse.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < maxDistance) {
                    let opacity = (0.4 - distance/maxDistance).toFixed(2);
                    ctx.strokeStyle = particleColor.replace('0.5', opacity);
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
            for (let b = a; b < particles.length; b++) {
                 let dx = particles[a].x - particles[b].x;
                 let dy = particles[a].y - particles[b].y;
                 let dist = Math.sqrt(dx*dx + dy*dy);
                 if(dist < maxDistance/2) {
                     let opacity = (0.15 - dist/(maxDistance/2)).toFixed(2);
                     ctx.strokeStyle = particleColor.replace('0.5', opacity);
                     ctx.lineWidth = 0.5;
                     ctx.beginPath();
                     ctx.moveTo(particles[a].x, particles[a].y);
                     ctx.lineTo(particles[b].x, particles[b].y);
                     ctx.stroke();
                 }
            }
        }
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!isAnimating) {
                    isAnimating = true;
                    animate();
                }
            } else {
                isAnimating = false;
                cancelAnimationFrame(animationFrameId);
            }
        });
    }, { threshold: 0 });

    observer.observe(section);
}

// Initializer function for script.js to call
export function initVisuals() {
    typeEffect();
    initConstellation(); 
    initClockAndQuotes();
    
    // Initialize Particles
    initSectionParticles('about', 'rgba(0, 174, 239, 0.5)', 120, 40); 
    initSectionParticles('skills', 'rgba(255, 255, 255, 0.5)', 100, 30); 
    initSectionParticles('projects', 'rgba(153, 51, 255, 0.5)', 130, 45); 
    initSectionParticles('experience', 'rgba(0, 204, 204, 0.5)', 110, 35); 
    initSectionParticles('certificates', 'rgba(255, 255, 255, 0.5)', 120, 40); 
}