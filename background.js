

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "downloadImage") {
    if (request.urls.length <= 0) return;

    const zip = new JSZip();

      // Map each URL to a fetch operation that retrieves the Blob and adds it to the zip
      const imageFetchPromises = request.urls.map(async (url, index) => {
        const response = await fetch(url);
        const blob = await response.blob();
        zip.file(`image${index + 1}.png`, blob);
      });

      // Wait for all fetch operations to complete
      await Promise.all(imageFetchPromises);

    chrome.downloads.download({
      url: request.url,
      filename: "midjourney_image.png",
      conflictAction: 'uniquify' // Optional
    }, function(downloadId) {
      console.log("Download initiated with ID:", downloadId);
    });
  }
});


