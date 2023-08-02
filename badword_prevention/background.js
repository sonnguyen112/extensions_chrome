var STATE = "OFF"

chrome.action.onClicked.addListener(async (tab) => {
    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON'
    STATE = nextState

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
        tabId: tab.id,
        text: nextState,
    });
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.cmd === "getState") {
      // Send a response back to the content script
      console.log("Content call")
      sendResponse({val: STATE});
    }
  });

chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});