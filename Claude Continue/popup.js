const status = document.getElementById('status');

document.getElementById('setTimerBtn').addEventListener('click', () => {
    const timeValue = document.getElementById('targetTimeInput').value;
    if (!timeValue) return;

    const [hours, minutes] = timeValue.split(':').map(Number);

    // Send the target time to the active tab's content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]) return;
        chrome.tabs.sendMessage(tabs[0].id, {
            action: "scheduleContinue",
            hours: hours,
            minutes: minutes
        }, (response) => {
            if (chrome.runtime.lastError || !response) {
                // Not a Claude tab, or the tab was open before the extension loaded.
                status.textContent = 'Open a Claude chat first. If it is already open, refresh the page and try again.';
                return;
            }
            status.textContent = `Scheduled for ${response.time}. Keep this tab open.`;
            setTimeout(() => window.close(), 1500);
        });
    });
});
