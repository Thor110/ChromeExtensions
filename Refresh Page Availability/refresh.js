// Function to check for the error and refresh
function checkAvailabilityError() {
  const errorMessage = "This content isn't available";
  
  // Look for the text within the body
  if (document.body.innerText.includes(errorMessage)) {
    console.log('Error detected! Refreshing page...');
    location.reload();
  }
}

// Observe the page for changes (YouTube loads content dynamically)
const observer = new MutationObserver((mutations) => {
  checkAvailabilityError();
});

// Start observing the document body
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Run an initial check in case it's already there
checkAvailabilityError();