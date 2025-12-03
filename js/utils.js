// =========================================
// UTILS: SOUND EFFECTS
// =========================================
const SOUND_SRC = 'assets/click.mp3'; 
const JUMP_SOUNDS = ['assets/hen.mp3', 'assets/hen2.mp3'];
let jumpSoundIndex = 0; 

export function playClickSound() {
    try {
        const audio = new Audio(SOUND_SRC);
        audio.volume = 0.2; 
        audio.currentTime = 0; 
        audio.play().catch(e => { });
    } catch (e) { console.warn("Sound error:", e); }
}

export function playJumpSound() {
    try {
        const audio = new Audio(JUMP_SOUNDS[jumpSoundIndex]);
        audio.volume = 0.2; 
        audio.currentTime = 0; 
        audio.play().catch(e => { });
        jumpSoundIndex = (jumpSoundIndex + 1) % JUMP_SOUNDS.length;
    } catch (e) { console.warn("Jump sound error:", e); }
}

// Attach click sounds to general elements
const clickSoundElements = document.querySelectorAll(
    'nav a, .contact-link, #modalProjectLink, #openGameTrigger, #closeGameButton'      
);

clickSoundElements.forEach(el => {
    el.addEventListener('click', () => { playClickSound(); });
});