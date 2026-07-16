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
        const now = Date.now();
        const distance = targetDate - now;

        if (distance <= 0) {
            // Countdown finished: ensure display shows zeros and reveal/enable buttons
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';

            revealSurprise();
            return;
        }

        // calculate time parts
        const seconds = Math.floor((distance / 1000) % 60);
        const minutes = Math.floor((distance / (1000 * 60)) % 60);
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));

        // format with leading zeros
        const fmt = (n) => String(n).padStart(2, '0');

        document.getElementById('days').textContent = fmt(days);
        document.getElementById('hours').textContent = fmt(hours);
        document.getElementById('minutes').textContent = fmt(minutes);
        document.getElementById('seconds').textContent = fmt(seconds);
    }

    // run once immediately and then every second
    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
}

// Reveal surprise section when countdown reaches zero
function revealSurprise() {
    // We keep the countdown visible per user preference.
    // Enable the YES/NO buttons so they become clickable now that the countdown finished.
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const surpriseSection = document.getElementById('surprise-section');

    // ensure surprise section is visible (index.html currently shows it by default)
    if (surpriseSection && surpriseSection.classList.contains('hidden')) {
        surpriseSection.classList.remove('hidden');
    }

    if (yesBtn) {
        yesBtn.disabled = false;
        yesBtn.style.opacity = '1';
        yesBtn.style.cursor = 'pointer';
        yesBtn.removeAttribute('aria-disabled');
        // focus YES for accessibility
        setTimeout(() => yesBtn.focus(), 50);
        // keep existing behavior: navigate to surprise.html when clicked
        yesBtn.addEventListener('click', function() {
            window.location.href = 'surprise.html';
        });
    }

    if (noBtn) {
        noBtn.disabled = false;
        noBtn.style.opacity = '1';
        noBtn.style.cursor = 'pointer';
        noBtn.removeAttribute('aria-disabled');
    }

    // set up NO button behavior now that it's enabled
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
    if (!noBtn) return; // guard

    // Remove any previous listeners (defensive) by cloning the node
    const newNoBtn = noBtn.cloneNode(true);
    noBtn.parentNode.replaceChild(newNoBtn, noBtn);

    newNoBtn.addEventListener('mouseenter', function(e) {
        // don't try to escape if it's not enabled
        if (newNoBtn.disabled) return;
        if (isEscaping) return;
        
        isEscaping = true;
        escapeCount++;

        // Get button position
        const btnRect = newNoBtn.getBoundingClientRect();
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;

        // Calculate direction from cursor to button
        const directionX = btnCenterX - mouseX;
        const directionY = btnCenterY - mouseY;

        // Normalize direction
        const distance = Math.sqrt(directionX * directionX + directionY * directionY) || 1;
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
            animateNoButtonEscape(newNoBtn, newX, newY, () => {
                isEscaping = false;
            });
        } else {
            // Final escape with legs
            if (!hasLegs) {
                addLegsToNoButton(newNoBtn);
                hasLegs = true;
            }
            animateNoButtonFinalEscape(newNoBtn, newX, newY, buttonsContainer);
        }
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
    const distance = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
    
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
