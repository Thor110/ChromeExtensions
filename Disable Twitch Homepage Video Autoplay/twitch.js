console.log('Content script injected');

let buttonClicked = false;

function disableLoop() {
  console.log('disableLoop function called');
  const button = document.querySelector('[data-a-target="player-play-pause-button"]');
  console.log('Button query result:', button);

  if (button &&!buttonClicked) {
    console.log('Button found');
    buttonClicked = true;
    setTimeout(() => {
      button.click();
      console.log('Button click event triggered');
    }, 1000);
  } else if (button) {
    console.log('Button already clicked');
    clearInterval(myInterval);
  } else {
    console.log('Button not found');
  }
}

const myInterval = setInterval(disableLoop, 1000);