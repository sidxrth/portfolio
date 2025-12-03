import { playClickSound } from './utils.js';
import { hideLampPopup } from './ui.js';

// =========================================
// PROJECT MODAL & GALLERY
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
const gameOverlay = document.getElementById('gameOverlay');

let currentProjectData = null;
let currentImageIndex = 0;

// --- PROJECTS DATA ---
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
    playClickSound(); 
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
    hideLampPopup();
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
    playClickSound(); 
}

function showPrevImage() {
    if (!currentProjectData || currentProjectData.images.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + currentProjectData.images.length) % currentProjectData.images.length;
    updateImageDisplay();
    playClickSound(); 
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

if (closeModalButton) closeModalButton.addEventListener('click', () => { closeProjectModal(); playClickSound(); });
if (prevImageButton) prevImageButton.addEventListener('click', showPrevImage);
if (nextImageButton) nextImageButton.addEventListener('click', showNextImage);

if (projectModal) {
    projectModal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) { closeProjectModal(); playClickSound(); }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (projectModal && projectModal.classList.contains('visible')) { closeProjectModal(); playClickSound(); }
        // Game overlay escape is handled in game.js, but simple close here too
        if (gameOverlay && !gameOverlay.classList.contains('hidden')) { 
            // We let the game module handle logic, this just covers simple cases if needed
        }
    }
});