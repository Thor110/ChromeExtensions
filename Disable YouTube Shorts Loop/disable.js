// YouTube is a single-page app, so this script runs on every YouTube page
// and only acts while a Shorts video is open.
const CHECK_INTERVAL_MS = 1000;
const STUCK_LIMIT = 5;          // seconds without progress before a reload
const MAX_RELOADS = 3;          // reloads allowed inside RELOAD_WINDOW_MS
const RELOAD_WINDOW_MS = 5 * 60 * 1000;
const RELOAD_KEY = 'shortsLoopDisabler.reloads';

let lastTime = -1;
let lastPath = '';
let stuckCounter = 0;

function onShortsPage() {
    return location.pathname.startsWith('/shorts/');
}

function disableLoops() {
    // Check every video, YouTube can keep hidden players around.
    document.querySelectorAll('video').forEach(v => {
        if (v.loop) {
            v.loop = false;
            v.removeAttribute('loop');
        }
    });
}

function activeVideo() {
    // Prefer the video that is actually on screen.
    const videos = [...document.querySelectorAll('video')];
    return videos.find(v => v.offsetParent !== null && v.readyState > 0) || videos[0] || null;
}

// Stop reload loops: allow only a few reloads in a short window.
function reloadAllowed() {
    const now = Date.now();
    let history = [];
    try {
        history = JSON.parse(sessionStorage.getItem(RELOAD_KEY) || '[]')
            .filter(t => now - t < RELOAD_WINDOW_MS);
    } catch (e) { /* storage unavailable or corrupt */ }
    if (history.length >= MAX_RELOADS) return false;
    history.push(now);
    try { sessionStorage.setItem(RELOAD_KEY, JSON.stringify(history)); } catch (e) {}
    return true;
}

function checkPulse() {
    disableLoops();

    if (!onShortsPage() || document.hidden) {
        stuckCounter = 0;
        lastTime = -1;
        return;
    }

    // Give the page a fresh start after moving to another Short.
    if (location.pathname !== lastPath) {
        lastPath = location.pathname;
        stuckCounter = 0;
        lastTime = -1;
        return;
    }

    const video = activeVideo();
    if (!video) {
        stuckCounter++;
    } else if (!video.paused && !video.ended && video.currentTime === lastTime) {
        stuckCounter++;
    } else {
        stuckCounter = 0;
    }
    lastTime = video ? video.currentTime : -1;

    if (stuckCounter >= STUCK_LIMIT) {
        stuckCounter = 0;
        if (reloadAllowed()) {
            console.log('Watchdog: No pulse detected. Force refreshing...');
            location.reload();
        } else {
            console.log('Watchdog: Video still stuck, but reload limit reached. Not refreshing.');
        }
    }
}

setInterval(checkPulse, CHECK_INTERVAL_MS);
// Catch loop being turned back on quickly between pulse checks.
setInterval(disableLoops, 250);
