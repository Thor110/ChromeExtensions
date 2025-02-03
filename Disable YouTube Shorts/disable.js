// contentScript.js
function disableLoop() {
  const video = document.querySelector('video');
  if (video) {
    video.removeAttribute('loop');
  }
}

// Run the function when the page loads
document.addEventListener('DOMContentLoaded', disableLoop);

// Run the function every second to ensure looping is disabled
setInterval(disableLoop, 1000);