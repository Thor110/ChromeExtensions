// contentScript.js
console.log('Content script injected');
function disableLoop() {
  console.log('disableLoop function called');
  const loopCheckbox = document.querySelector('.ytp-menuitem[role="menuitemcheckbox"]');
  if (loopCheckbox) {
    loopCheckbox.setAttribute('aria-checked', 'false');
	console.log('aria-checked set to false');
  }
  const video = document.querySelector('video');
  if (video) {
    video.removeAttribute('loop');
	console.log('loop attribute removed');
  }
}

setInterval(disableLoop, 100);