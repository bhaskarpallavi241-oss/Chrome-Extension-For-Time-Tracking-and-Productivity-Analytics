let currentTab = null;
let currentStartTime = null;
const PRODUCTIVE_SITES = ["leetcode.com", "github.com", "stackoverflow.com"];
const UNPRODUCTIVE_SITES = ["facebook.com", "instagram.com", "youtube.com"];
function classifySite(hostname) {
  if (PRODUCTIVE_SITES.includes(hostname)) return "productive";
  if (UNPRODUCTIVE_SITES.includes(hostname)) return "unproductive";
  return "neutral";
}
function trackTime(tab) {
  const now = new Date();
  if (currentTab && currentStartTime) {
    const duration = Math.floor((now - currentStartTime) / 1000);
    const hostname = new URL(currentTab.url).hostname;
    const classification = classifySite(hostname);
    const data = {
      url: hostname,
      duration,
      timestamp: currentStartTime.toISOString(),
      classification
    };
    fetch("http://localhost:5000/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(() => {
      console.log("Tracked:", data);
    }).catch(err => {
      console.error("Tracking failed:", err);
    });
  }
  currentTab = tab;
  currentStartTime = now;
}
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, trackTime);
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    trackTime(tab);
  }
});
chrome.windows.onFocusChanged.addListener(windowId => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) return;
  chrome.tabs.query({ active: true, windowId }, tabs => {
    if (tabs[0]) trackTime(tabs[0]);
  });
});
