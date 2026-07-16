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

// NO button behavior
function setupNoButtonBehavior() {
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    let clickCount = 0;
    let hasLegs = false;

    noBtn.addEventListener('click', function(e) {
        e.preventDefault();
        clickCount++;

        if (clickCount === 1) {
            // Move to far left
            animateNoButtonToLeft();
        } else if (clickCount === 2) {
            // Move to far right
            animateNoButtonToRight();
        } else if (clickCount === 3) {
            // Grow legs and run away
            if (!hasLegs) {
                addLegsToNoButton();
                hasLegs = true;
            }
            animateNoButtonRunAway();
        }
    });

    yesBtn.addEventListener('click', function() {
        window.location.href = 'surprise.html';
    });
}

function animateNoButtonToLeft() {
    const noBtn = document.getElementById('no-btn');
    noBtn.style.transition = 'all 0.6s ease';
    noBtn.style.left = '5%';
    noBtn.style.transform = 'translateX(0)';
}

function animateNoButtonToRight() {
    const noBtn = document.getElementById('no-btn');
    noBtn.style.transition = 'all 0.6s ease';
    noBtn.style.left = '95%';
    noBtn.style.transform = 'translateX(-100%)';
}

function addLegsToNoButton() {
    const noBtn = document.getElementById('no-btn');
    
    const legLeft = document.createElement('div');
    legLeft.className = 'leg leg-left';
    
    const legRight = document.createElement('div');
    legRight.className = 'leg leg-right';
    
    noBtn.appendChild(legLeft);
    noBtn.appendChild(legRight);
}

function animateNoButtonRunAway() {
    const noBtn = document.getElementById('no-btn');
    noBtn.style.transition = 'all 1s ease-in';
    noBtn.style.left = '150%';
    noBtn.style.opacity = '0';
    
    setTimeout(() => {
        noBtn.style.display = 'none';
    }, 1000);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    startCountdown();
});
