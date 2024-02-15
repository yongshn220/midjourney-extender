

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "downloadImage" && request.url) {
    // Use the chrome.downloads API to download the image
    chrome.downloads.download({
      url: request.url,
      filename: "midjourney_image.png",
      conflictAction: 'uniquify' // Optional
    }, function(downloadId) {
      console.log("Download initiated with ID:", downloadId);
    });
  }
});


