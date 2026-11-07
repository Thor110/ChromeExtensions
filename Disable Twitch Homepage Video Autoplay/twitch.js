// twitch.js
// Twitch is a single-page app, so this script runs on every Twitch page
// and only acts on the homepage. Without that check it would keep pausing
// streams after you click through to a channel.
console.log('Stuck Twitch: Anti-Autoplay engaged.');

// Videos the user chose to play themselves. These are left alone.
const allowedVideos = new WeakSet();
let lastUserAction = 0;

// Remember real clicks and key presses so a play that follows one counts
// as the user's choice, not autoplay.
['pointerdown', 'keydown'].forEach(type => {
    document.addEventListener(type, (e) => {
        if (e.isTrusted) lastUserAction = Date.now();
    }, true);
});

document.addEventListener('play', (e) => {
    if (e.target instanceof HTMLVideoElement && Date.now() - lastUserAction < 1000) {
        allowedVideos.add(e.target);
    }
}, true);

function onHomepage() {
    return location.pathname === '/';
}

function stopTheScreaming() {
    if (!onHomepage()) return;

    document.querySelectorAll('video').forEach(video => {
        if (!video.paused && !allowedVideos.has(video)) {
            console.log('Autoplay detected. Pausing...');
            video.pause();

            // Mute it as a backup in case it manages to override the pause.
            video.muted = true;
        }
    });
}

// Run the check every 500ms to catch any late-loading videos or forced resets.
setInterval(stopTheScreaming, 500);
