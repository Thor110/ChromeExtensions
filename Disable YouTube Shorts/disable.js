// contentScript.js
function disableLoop() {
  const video = document.querySelector('video');
  if (video) {
    video.removeAttribute('loop');
  }
  const loopCheckbox = document.querySelector('.ytp-menuitem[role="menuitemcheckbox"]');
  if (loopCheckbox) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'aria-checked' && mutation.target.getAttribute('aria-checked') === 'true') {
          mutation.target.setAttribute('aria-checked', 'false');
        }
      });
    });
    observer.observe(loopCheckbox, { attributes: true });
  }
}

// Run the function when the page loads
document.addEventListener('DOMContentLoaded', disableLoop);

// Run the function every second to ensure looping is disabled
setInterval(disableLoop, 100);