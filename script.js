// --- VARIABLES & DOM ELEMENTS ---
const popAudio = new Audio('pop.mp3');
const board = document.getElementById('bubble-board');
const popCountDisplay = document.getElementById('pop-count');
const treasureStashDisplay = document.getElementById('treasure-stash');
const refillBtn = document.getElementById('refill-btn');
const themeBtn = document.getElementById('theme-btn');
const startBtn = document.getElementById('start-btn');
const timerDisplay = document.getElementById('timer-display');

// Arcade Treasures & Game State
const treasures = ['🗡️', '🍬', '🦆', '💎', '🍕', '🎸', '👽'];
let popCount = 0;
let foundTreasures = [];
let timeLeft = 60;
let timerInterval;
let isPlaying = true; // Controls if bubbles can be popped

// Bright Arcade Colors
const hues = [0, 30, 60, 90, 180, 240, 280, 320]; 

// --- FUNCTIONS ---
function createBoard() {
    board.innerHTML = ''; 
    
    // Fills the exact width and height of the screen
    const bubbleSize = 55; 
    const cols = Math.floor(window.innerWidth / bubbleSize);
    const rows = Math.floor(window.innerHeight / bubbleSize); 
    const totalBubbles = cols * (rows + 2); 

    for (let i = 0; i < totalBubbles; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        // Shiny 3D Gradient
        const randomHue = hues[Math.floor(Math.random() * hues.length)];
        bubble.style.background = `radial-gradient(circle at 30% 30%, hsl(${randomHue}, 100%, 75%), hsl(${randomHue}, 100%, 45%))`;

        // 10% chance for treasure
        if (Math.random() < 0.1) {
            bubble.dataset.treasure = treasures[Math.floor(Math.random() * treasures.length)];
        }
        
        board.appendChild(bubble);
    }
}

// --- EVENT LISTENERS ---

// Dark Mode Toggle
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Time Attack Start
startBtn.addEventListener('click', () => {
    createBoard(); // Reset the board
    timeLeft = 60;
    popCount = 0;
    popCountDisplay.innerText = popCount;
    isPlaying = true;
    
    clearInterval(timerInterval); // Reset any existing timers
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `Time: ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            isPlaying = false; // Stop the popping!
            alert(`TIME'S UP! You popped ${popCount} bubbles!`);
        }
    }, 1000);
});

// Popping Interaction
board.addEventListener('click', (e) => {
    const bubble = e.target.closest('.bubble');
    
    // ONE single check: Does it exist? Is it unpopped? Is the game active?
    if (bubble && !bubble.classList.contains('popped') && isPlaying) {
        
        // 1. Mark as popped and update score
        bubble.classList.add('popped');
        popCount++;
        popCountDisplay.innerText = popCount;

        // 2. Fire the Confetti!
        const rect = bubble.getBoundingClientRect();
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 25,
                spread: 50,
                origin: { 
                    x: (rect.left + rect.width / 2) / window.innerWidth, 
                    y: (rect.top + rect.height / 2) / window.innerHeight 
                }
            });
        }

        // 3. Play sound 
        if (popAudio) {
            popAudio.currentTime = 0;
            popAudio.play().catch(() => {}); 
        }

        // 4. Trigger Easter Egg Treasure
        if (bubble.dataset.treasure) {
            const treasure = bubble.dataset.treasure;
            const emojiSpan = document.createElement('span');
            emojiSpan.innerText = treasure;
            emojiSpan.classList.add('treasure-anim');
            bubble.appendChild(emojiSpan);
            
            foundTreasures.push(treasure);
            treasureStashDisplay.innerText = foundTreasures.join(' ');
        }
    }
});

// Refill the board
refillBtn.addEventListener('click', createBoard);

// Redraw board when window resizes
window.addEventListener('resize', createBoard);

// --- START GAME ---
createBoard();
