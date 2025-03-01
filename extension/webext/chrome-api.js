export function getCurrentTabUrl(callback) {
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0) {
        callback(tabs[0].url);
      } else {
        callback(null);
      }
    });
  } else {
    console.error('Chrome tabs API is not available.');
    callback(null);
  }
}
