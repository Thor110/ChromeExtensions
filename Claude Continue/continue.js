let pendingTimer = null;

function findSendButton() {
    return document.querySelector('button[aria-label*="Send"]:not([disabled]), button[type="submit"]:not([disabled])');
}

// Claude's message box is a rich text editor, so insert text the way typing
// would. Setting textContent directly can leave the editor out of sync.
function typeContinue(input) {
    input.focus();
    if (input.isContentEditable) {
        document.execCommand('selectAll', false, null);
        if (!document.execCommand('insertText', false, 'continue')) {
            input.textContent = 'continue';
        }
    } else {
        input.value = 'continue';
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
}

function sendContinue() {
    const input = document.querySelector('div[contenteditable="true"], textarea');
    if (!input) {
        console.log('[Claude Continue] Message box not found.');
        return;
    }
    typeContinue(input);

    // The send button can take a moment to become enabled.
    let attempts = 0;
    const trySend = () => {
        const sendButton = findSendButton();
        if (sendButton) {
            sendButton.click();
            console.log('[Claude Continue] Sent "continue".');
        } else if (++attempts < 10) {
            setTimeout(trySend, 500);
        } else {
            console.log('[Claude Continue] Send button not found.');
        }
    };
    setTimeout(trySend, 500);
}

function scheduleTargetTime(hours, minutes) {
    const now = new Date();
    const target = new Date();

    target.setHours(hours, minutes, 0, 0);

    if (target <= now) {
        target.setDate(target.getDate() + 1);
    }

    // Replace any earlier timer so "continue" is only sent once.
    if (pendingTimer) clearTimeout(pendingTimer);

    const delay = target.getTime() - now.getTime();
    console.log(`[Claude Continue] Scheduled for ${target.toLocaleTimeString()}.`);

    pendingTimer = setTimeout(() => {
        pendingTimer = null;
        sendContinue();
    }, delay);

    return target;
}

// Listen for the timer configuration message coming from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scheduleContinue") {
        const target = scheduleTargetTime(request.hours, request.minutes);
        sendResponse({ status: "scheduled", time: target.toLocaleString() });
    }
});
