const board = document.getElementById('bubble-board');
const popSound = document.getElementById('pop-sound');
const popCountDisplay = document.getElementById('pop-count');
const treasureStashDisplay = document.getElementById('treasure-stash');
const themeToggle = document.getElementById('theme-toggle');
const refillBtn = document.getElementById('refill-btn');

// Easter Egg Treasures!
const treasures = ['🗡️', '🍬', '🦆', '💎', '🍕', '🎸', '👽'];
let popCount = 0;
let foundTreasures = [];
const TOTAL_BUBBLES = 60; 

// Generate the bubbles
function createBoard() {
    board.innerHTML = ''; // Clear board
    for (let i = 0; i < TOTAL_BUBBLES; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        // 10% chance to hide a treasure in this bubble
        if (Math.random() < 0.1) {
            const randomTreasure = treasures[Math.floor(Math.random() * treasures.length)];
            bubble.dataset.treasure = randomTreasure;
        }
        
        board.appendChild(bubble);
    }
}

// Interaction 1: Popping Bubbles (using Event Delegation)
board.addEventListener('click', (e) => {
    const bubble = e.target.closest('.bubble');
    
    if (bubble && !bubble.classList.contains('popped')) {
        // Pop it
        bubble.classList.add('popped');
        popCount++;
        popCountDisplay.innerText = popCount;

        // Reset and play sound
        popSound.currentTime = 0;
        popSound.play();

        // Check for easter egg treasure
        if (bubble.dataset.treasure) {
            const treasure = bubble.dataset.treasure;
            
            // Visual floating animation
            const emojiSpan = document.createElement('span');
            emojiSpan.innerText = treasure;
            emojiSpan.classList.add('treasure-anim');
            bubble.appendChild(emojiSpan);

            // Add to stash
            foundTreasures.push(treasure);
            treasureStashDisplay.innerText = foundTreasures.join(' ');
        }
    }
});

// Interaction 2: Refill with a "wave" animation
refillBtn.addEventListener('click', () => {
    const allBubbles = document.querySelectorAll('.bubble');
    allBubbles.forEach((bubble, index) => {
        // Stagger the refill so it looks like a wave across the grid
        setTimeout(() => {
            bubble.classList.remove('popped');
            bubble.innerHTML = ''; // Clear found treasures from DOM
            
            // Re-roll treasures for the new board
            bubble.removeAttribute('dataset');
            if (Math.random() < 0.1) {
                bubble.dataset.treasure = treasures[Math.floor(Math.random() * treasures.length)];
            } else {
                delete bubble.dataset.treasure;
            }
        }, index * 10); 
    });
});

// Interaction 3: Dark Mode Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.innerText = '☀️ Light Mode';
    } else {
        themeToggle.innerText = '🌙 Dark Mode';
    }
});

// Initialize
createBoard();
