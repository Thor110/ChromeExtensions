function scheduleTargetTime(hours, minutes) {
    const now = new Date();
    const target = new Date();
    
    target.setHours(hours, minutes, 0, 0);
    
    if (target <= now) {
        target.setDate(target.getDate() + 1);
    }
    
    const delay = target.getTime() - now.getTime();
    console.log(`[Claude Continue] Scheduled for ${target.toLocaleTimeString()}.`);

    setTimeout(() => {
        const input = document.querySelector('div[contenteditable="true"], textarea');
        if (input) {
            input.focus();
            input.textContent = 'continue';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            
            setTimeout(() => {
                const sendButton = document.querySelector('button[aria-label*="Send"], button[type="submit"]');
                if (sendButton) {
                    sendButton.click();
                }
            }, 500);
        }
    }, delay);
}

// Listen for the timer configuration message coming from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scheduleContinue") {
        scheduleTargetTime(request.hours, request.minutes);
        sendResponse({ status: "scheduled" });
    }
});