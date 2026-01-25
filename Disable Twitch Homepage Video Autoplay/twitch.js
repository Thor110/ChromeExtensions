// twitch.js
console.log('Stuck Twitch: Anti-Autoplay engaged.');

function stopTheScreaming() {
    // 1. Target the video element directly. This is much harder for them to hide.
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // 2. If it's the homepage video and it's trying to play, stop it.
        if (!video.paused) {
            console.log('Autoplay detected. Pausing...');
            video.pause();
            
            // 3. Mute it as a backup in case it manages to override the pause.
            video.muted = true;
        }
    });
}

// Run the check every 500ms to catch any late-loading videos or forced resets.
setInterval(stopTheScreaming, 500);