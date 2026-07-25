document.getElementById('setTimerBtn').addEventListener('click', () => {
    const timeValue = document.getElementById('targetTimeInput').value;
    if (!timeValue) return;

    const [hours, minutes] = timeValue.split(':').map(Number);

    // Send the target time to the active tab's content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { 
                action: "scheduleContinue", 
                hours: hours, 
                minutes: minutes 
            }, (response) => {
                // Catch the missing listener error gracefully if not on a Claude tab
                if (chrome.runtime.lastError) {
                    console.log("[Popup] Target tab is not an active Claude chat session.");
                }
                window.close(); // Close the popup upon completion
            });
        }
    });
});