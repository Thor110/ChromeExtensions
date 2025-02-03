// contentScript.js
function disableLoop() {
  const loopCheckbox = document.querySelector('.ytp-menuitem[role="menuitemcheckbox"]');
  if (loopCheckbox) {
    loopCheckbox.setAttribute('aria-checked', 'false');
  }
  const video = document.querySelector('video');
  if (video) {
    video.removeAttribute('loop');
  }
}

disableLoop();