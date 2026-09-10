const popAudio = new Audio('pop.mp3');
const board = document.getElementById('bubble-board');
const popCountDisplay = document.getElementById('pop-count');
const treasureStashDisplay = document.getElementById('treasure-stash');
const refillBtn = document.getElementById('refill-btn');

// Arcade Treasures & Variables
const treasures = ['🗡️', '🍬', '🦆', '💎', '🍕', '🎸', '👽'];
let popCount = 0;
let foundTreasures = [];

// Bright Arcade Colors
const hues = [0, 30, 60, 90, 180, 240, 280, 320]; 

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

// Popping Interaction
board.addEventListener('click', (e) => {
    const bubble = e.target.closest('.bubble');
    
    if (bubble && !bubble.classList.contains('popped')) {
        bubble.classList.add('popped');
        popCount++;
        popCountDisplay.innerText = popCount;

        // Play sound if you uploaded pop.mp3!
        if (popAudio) {
            popAudio.currentTime = 0;
            popAudio.play().catch(() => {}); // Prevents errors if sound is missing
        }

        // Trigger Easter Egg Treasure
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

// Start game
createBoard();
