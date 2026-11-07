// YouTube is a single-page app, so this script runs on every YouTube page
// and only acts on video (watch) pages.
const ERROR_MESSAGE = "This content isn't available";
const MAX_RELOADS = 3;                   // reloads allowed per video...
const RELOAD_WINDOW_MS = 5 * 60 * 1000;  // ...inside this window
const RELOAD_KEY = 'availabilityRefresher.reloads';

// Only look inside the player, so comments, titles or descriptions that
// happen to contain the message never trigger a reload.
const PLAYER_SELECTORS = [
  '#movie_player',
  'ytd-player',
  '#player',
  '#player-container',
  '.ytp-error',
  'yt-playability-error-supported-renderers'
].join(',');

function onWatchPage() {
  return location.pathname === '/watch';
}

function videoId() {
  return new URLSearchParams(location.search).get('v') || location.href;
}

// Stop reload loops on videos that are really unavailable.
function reloadAllowed() {
  const now = Date.now();
  const id = videoId();
  let all = {};
  try { all = JSON.parse(sessionStorage.getItem(RELOAD_KEY) || '{}'); } catch (e) {}
  const history = (all[id] || []).filter(t => now - t < RELOAD_WINDOW_MS);
  if (history.length >= MAX_RELOADS) return false;
  history.push(now);
  all[id] = history;
  try { sessionStorage.setItem(RELOAD_KEY, JSON.stringify(all)); } catch (e) {}
  return true;
}

let gaveUpOn = null;

function checkAvailabilityError() {
  if (!onWatchPage()) return;
  const id = videoId();
  if (gaveUpOn === id) return;

  const hasError = [...document.querySelectorAll(PLAYER_SELECTORS)]
    .some(el => el.innerText && el.innerText.includes(ERROR_MESSAGE));
  if (!hasError) return;

  if (reloadAllowed()) {
    console.log('Error detected! Refreshing page...');
    location.reload();
  } else {
    gaveUpOn = id;
    console.log('Error still showing after several refreshes. Giving up on this video.');
  }
}

// YouTube changes the page constantly, so batch checks instead of
// running one on every single change.
let pending = null;
const observer = new MutationObserver(() => {
  if (pending) return;
  pending = setTimeout(() => {
    pending = null;
    checkAvailabilityError();
  }, 500);
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Run an initial check in case it's already there
checkAvailabilityError();
