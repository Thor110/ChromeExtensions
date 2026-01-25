let lastTime = -1;
let stuckCounter = 0;

function checkPulse() {
    const video = document.querySelector('video');
    
    // 1. If no video element exists at all on a Shorts page, that's a fail.
    if (!video) {
        stuckCounter++;
    } else {
        // 2. Check if the video time is moving
        if (video.currentTime === lastTime && !video.paused) {
            stuckCounter++;
        } else {
            stuckCounter = 0; // It's alive!
        }
        lastTime = video.currentTime;
    }

    // 3. If stuck for 5 seconds (5 checks at 1000ms)
    if (stuckCounter >= 5) {
        console.log("Watchdog: No pulse detected. Force refreshing...");
        location.reload();
    }
}

// Check every second
setInterval(checkPulse, 1000);

// Anti-Loop Logic (Standalone)
setInterval(() => {
    const v = document.querySelector('video');
    if (v && v.loop) {
        v.loop = false;
        v.removeAttribute('loop');
    }
}, 500);