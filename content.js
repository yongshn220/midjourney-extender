(() => {
  console.log("begin")
  function observeDOM(element) {
    if (!element) {
      console.error('The specified element does not exist.');
      return;
    }
    const observer = new MutationObserver((mutations) => {
      overrideImageElement();
    });

    const config = {
      childList: true, // Set to true to observe the addition or removal of child nodes
      subtree: false // Observe the target node and its entire subtree
    };

    observer.observe(element, config);
}
  function overrideImageElement() {
    console.log("overrideImageElement");
    let xpathResult = document.evaluate('//div[contains(@class, "container/jobCard")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    for (let i = 0; i < xpathResult.snapshotLength; i++) {
      const item = xpathResult.snapshotItem(i);

      const placeHolderId = `placeholder_${i}`
      const selectEffectId = `select_effect_${i}`

      if (!item.querySelector(`#${placeHolderId}`)) {
        const option = `
          <div id="${placeHolderId}" class="absolute top-0 w-full h-full">
            <div id="${selectEffectId}" class="w-full h-full flex justify-end items-start bg-black/20 p-2" style="display:none">
              <div class="flex items-center justify-center aspect-square rounded-md" style="background-color: #00B8FF">
                <img
                  alt="select icon"
                  src="${chrome.runtime.getURL("images/select.svg")}"
                />
              </div>
            </div>
          </div>
        `
        item.insertAdjacentHTML('afterbegin', option)

        const placeHolder = document.getElementById(placeHolderId)
        const selectEffect = document.getElementById(selectEffectId)
        placeHolder.addEventListener('click', () => {
          selectEffect.style.display = (selectEffect.style.display === 'none') ? '' : 'none'
        })
      }
    }
  }
  function extractImageUrl(item) {
    const imageElement = item.querySelector('a');
    const backgroundImageStyle = imageElement.style.backgroundImage;

    const regex = /https:\/\/cdn\.midjourney\.com\/(.*?)_384_N\.webp/;
    const match = backgroundImageStyle.match(regex);
    if (!match) return null

    const keyValue = match[1];
    return `https://cdn.midjourney.com/${keyValue}.png`;

    // chrome.runtime.sendMessage({action: "downloadImage", url: url});
  }

  function onDocumentReady() {
    console.log("Document loaded");
    overrideImageElement();
    const page = document.getElementById('pageScroll')
    console.log("page", page)
    observeDOM(page);
  }

  console.log(document.readyState)

  if (document.readyState === "complete") {
    // If document is already fully loaded, run the function immediately.
    onDocumentReady();
  }
  else {
    // Otherwise, wait for the window 'load' event which signifies the document and all sub-resources are fully loaded.
    window.addEventListener('load', onDocumentReady);
  }
})();
