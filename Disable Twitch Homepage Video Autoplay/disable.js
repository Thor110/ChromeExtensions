// contentScript.js
function disableLoop() {
  const label = document.querySelector('.ytp-menuitem[aria-label="Play (space/k)"]');
  if (label) {
    label.setAttribute('aria-label', 'Pause (space/k)');
  }
  const state = document.querySelector('.ytp-menuitem[data-a-player-state="playing"]');
  if (state) {
    state.setAttribute('data-a-player-state', 'paused');
  }
}

document.addEventListener('DOMContentLoaded', disableLoop);