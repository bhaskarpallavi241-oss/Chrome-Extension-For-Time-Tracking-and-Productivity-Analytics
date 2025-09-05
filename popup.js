let startTime = Date.now();

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = new URL(tabs[0].url);
  const domain = url.hostname;
  document.getElementById("domain").textContent = domain;
});
setInterval(() => {
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById("time").textContent = seconds;
}, 1000);
