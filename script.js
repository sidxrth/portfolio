// =========================================
// MAIN SCRIPT CONTROLLER
// =========================================

// Import modules to execute their side-effects (event listeners)
import './js/utils.js';
import './js/ui.js';
import './js/game.js';
import './js/projects.js';

// Import visuals to initialize them specifically
import { initVisuals } from './js/visuals.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations and visual effects when DOM is ready
    initVisuals();
    console.log("Portfolio Main Script Loaded");
});