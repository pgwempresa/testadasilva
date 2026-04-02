document.addEventListener('DOMContentLoaded', () => {
    // Confetti Effect Settings
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Confetti from left
        confetti(Object.assign({}, defaults, { 
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#000000', '#666666', '#cccccc', '#ececec']
        }));
        
        // Confetti from right
        confetti(Object.assign({}, defaults, { 
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#000000', '#666666', '#cccccc', '#ececec']
        }));
    }, 250);

    // Initial big burst
    confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#000000', '#666666', '#cccccc', '#ececec']
    });

    // Countdown Timer (14 minutes and 54 seconds)
    let time = (14 * 60) + 54;
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    const updateTimer = setInterval(() => {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;

        seconds = seconds < 10 ? '0' + seconds : seconds;
        let displayMinutes = minutes < 10 ? '0' + minutes : minutes;

        minutesElement.textContent = displayMinutes;
        secondsElement.textContent = seconds;

        if (time > 0) {
            time--;
        } else {
            clearInterval(updateTimer);
        }
    }, 1000);
});
