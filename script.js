// Create animated sparkling stars
function createStars() {
    const starsContainer = document.getElementById('stars-container');
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const delay = Math.random() * 2;
        
        star.style.left = x + '%';
        star.style.top = y + '%';
        star.style.animationDelay = delay + 's';
        
        starsContainer.appendChild(star);
    }
}

// Countdown timer
function startCountdown() {
    const targetDate = new Date('July 19, 2026 00:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance <= 0) {
            // Countdown finished
            revealSurprise();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Reveal surprise section when countdown reaches zero
function revealSurprise() {
    const countdownSection = document.getElementById('countdown-section');
    const surpriseSection = document.getElementById('surprise-section');
    
    countdownSection.style.display = 'none';
    surpriseSection.classList.remove('hidden');
    
    setupNoButtonBehavior();
}

// NO button cursor tracking and escape behavior
function setupNoButtonBehavior() {
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const buttonsContainer = document.getElementById('buttons-container');
    let escapeCount = 0;
    let isEscaping = false;
    let hasLegs = false;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // Track mouse position
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // NO button escape on hover/approach
    noBtn.addEventListener('mouseenter', function(e) {
        if (isEscaping) return;
        
        isEscaping = true;
        escapeCount++;

        // Get button position
        const btnRect = noBtn.getBoundingClientRect();
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;

        // Calculate direction from cursor to button
        const directionX = btnCenterX - mouseX;
        const directionY = btnCenterY - mouseY;

        // Normalize direction
        const distance = Math.sqrt(directionX * directionX + directionY * directionY);
        const normalizedX = directionX / distance;
        const normalizedY = directionY / distance;

        // Escape distance (250-400px depending on which escape this is)
        let escapeDistance = 300;
        if (escapeCount === 3) {
            escapeDistance = 500; // Longer for final escape
        }

        // Calculate new position
        const newX = btnCenterX + normalizedX * escapeDistance;
        const newY = btnCenterY + normalizedY * escapeDistance;

        if (escapeCount < 3) {
            // Regular escape
            animateNoButtonEscape(noBtn, newX, newY, () => {
                isEscaping = false;
            });
        } else {
            // Final escape with legs
            if (!hasLegs) {
                addLegsToNoButton(noBtn);
                hasLegs = true;
            }
            animateNoButtonFinalEscape(noBtn, newX, newY, buttonsContainer);
        }
    });

    yesBtn.addEventListener('click', function() {
        window.location.href = 'surprise.html';
    });
}

function animateNoButtonEscape(btn, targetX, targetY, callback) {
    btn.style.position = 'fixed';
    btn.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    btn.style.left = targetX + 'px';
    btn.style.top = targetY + 'px';
    btn.style.transform = 'translate(-50%, -50%)';

    setTimeout(callback, 500);
}

function addLegsToNoButton(btn) {
    const legLeft = document.createElement('div');
    legLeft.className = 'leg leg-left';
    
    const legRight = document.createElement('div');
    legRight.className = 'leg leg-right';
    
    btn.appendChild(legLeft);
    btn.appendChild(legRight);
}

function animateNoButtonFinalEscape(btn, targetX, targetY, container) {
    btn.style.position = 'fixed';
    
    // Calculate escape direction (away from viewport center towards farther distance)
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const dirX = targetX - centerX;
    const dirY = targetY - centerY;
    const distance = Math.sqrt(dirX * dirX + dirY * dirY);
    
    const normalizedX = dirX / distance;
    const normalizedY = dirY / distance;
    
    // Final escape position - very far outside viewport
    const finalX = centerX + normalizedX * 1200;
    const finalY = centerY + normalizedY * 1200;
    
    // Start running animation
    btn.style.transition = 'all 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    btn.style.left = finalX + 'px';
    btn.style.top = finalY + 'px';
    btn.style.transform = 'translate(-50%, -50%) scale(0.5)';
    btn.style.opacity = '0';
    
    // Remove button after animation completes
    setTimeout(() => {
        btn.remove();
    }, 2000);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    startCountdown();
});
