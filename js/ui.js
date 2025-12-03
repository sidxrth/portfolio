import { playClickSound } from './utils.js';

// =========================================
// LAMP POPUP & LIGHT MODE TRANSITION
// =========================================
const lampPopup = document.getElementById('lampPopup');
const lampYesBtn = document.getElementById('lampYes');
const lampNoBtn = document.getElementById('lampNo');
const transitionOverlay = document.getElementById('transitionOverlay');

export function showLampPopup() {
    const projectModal = document.getElementById('projectModal');
    const gameOverlay = document.getElementById('gameOverlay');

    if (lampPopup && 
        (!projectModal || !projectModal.classList.contains('visible')) && 
        (!gameOverlay || gameOverlay.classList.contains('hidden'))) {
        lampPopup.classList.remove('hidden');
        playClickSound(); 
    }
}

export function hideLampPopup() {
    if (lampPopup) lampPopup.classList.add('hidden');
}

if (lampYesBtn) {
    lampYesBtn.addEventListener('click', () => {
        playClickSound();
        hideLampPopup();
        
        if(transitionOverlay) {
            // 1. Unhide overlay (it is transparent by default due to inline style or logic)
            // We need to ensure it starts opacity 0
            transitionOverlay.style.opacity = '0';
            transitionOverlay.classList.remove('hidden');
            
            // 2. Trigger reflow
            void transitionOverlay.offsetWidth;

            // 3. Fade in to white (transition duration handled by CSS)
            transitionOverlay.style.opacity = '1';

            // 4. Wait for fade-in to complete
            setTimeout(() => {
                // Switch theme
                document.body.classList.add('light-mode');
                
                // Short delay to let the eye adjust to the "flash"
                setTimeout(() => {
                    // 5. Fade out
                    transitionOverlay.style.opacity = '0';
                    
                    // 6. Hide overlay after fade-out completes
                    setTimeout(() => {
                        transitionOverlay.classList.add('hidden');
                    }, 1000); // Wait for CSS transition (1s)
                }, 300); 
            }, 1000); // Wait for CSS transition (1s)
        } else {
            // Fallback if overlay is missing
            document.body.classList.add('light-mode');
        }
    });
}

if (lampNoBtn) {
    lampNoBtn.addEventListener('click', () => {
        playClickSound();
        hideLampPopup();
    });
}

// Trigger lamp popup after delay
setTimeout(showLampPopup, 3000);


// =========================================
// CERTIFICATES VIEW MORE LOGIC
// =========================================
const viewMoreBtn = document.getElementById('viewMoreCerts');
if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', () => {
        playClickSound(); 
        const hiddenCerts = document.querySelectorAll('.hidden-cert');
        hiddenCerts.forEach((cert, index) => {
            cert.style.display = 'block';
            setTimeout(() => {
                cert.style.opacity = '1';
                cert.style.transform = 'translateY(0)';
            }, index * 100); 
        });
        viewMoreBtn.style.display = 'none'; 
    });
}


// =========================================
// KONAMI CODE EASTER EGG (MATRIX MODE)
// =========================================
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateMatrixMode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateMatrixMode() {
    alert("ACCESS GRANTED: SYSTEM OVERRIDE");
    document.body.style.fontFamily = "'Courier New', monospace";
    document.body.style.color = "#00ff00";
    document.body.style.backgroundColor = "#000000";
    
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        el.style.color = '#00ff00';
        el.style.borderColor = '#00ff00';
    });
    
    const matrixCanvas = document.createElement('canvas');
    matrixCanvas.style.position = 'fixed';
    matrixCanvas.style.top = '0';
    matrixCanvas.style.left = '0';
    matrixCanvas.style.width = '100%';
    matrixCanvas.style.height = '100%';
    matrixCanvas.style.zIndex = '-1';
    matrixCanvas.style.opacity = '0.3';
    document.body.appendChild(matrixCanvas);
}