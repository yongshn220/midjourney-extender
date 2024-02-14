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
          <div id="${placeHolderId}" class="absolute top-0 w-full h-full ext-unchecked">
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

  function handleSelectModeClick() {

  }

  function onDocumentReady() {
    const page = document.getElementById('pageScroll')
    observeDOM(page);

    const controlBar = `
      <div id="ext-control-bar" class="fixed w-full flex ease-out justify-center items-center select-none bottom-5 translate-y-0" style="z-index: 3; left: 50%; transform: translateX(-50%)">
        <div class="relative rounded-xl border border-light-200/50 bg-white p-2 dark:border-dark-750 dark:bg-dark-750 shadow-xl shadow-black/20 dark:shadow-black/50" style="height: 56px;">
          <div class="absolute inset-0 rounded-xl overflow-hidden">
            <div class="absolute -inset-1 bg-gradient-to-t from-white/50 dark:from-dark-800/90"></div>
          </div>
          
          <div id="ext-idle-mode">
            <button class="disabled:!text-opacity-20 cursor-pointer select-none px-2 group-button group/button focus:.outline-none buttonActiveRing buttonHoverOpacity buttonActiveOpacity buttonActiveBackground buttonHoverBackground flex min-w-fit z-0 group-button shrink grow relative items-center justify-center gap-2 font-medium dark:bg-dark-700 border-light-200/10 text-light-700 border dark:border-dark-600/30 dark:text-dark-100 text-[13px] pl-3 py-2 text-center rounded-md disabled:pointer-events-none">
              Select Mode
            </button>
          </div>
          
          <div id="ext-select-mode" class="flex gap-1.5" style="display:none">
            <div class="flex relative gap-2 text-sm items-center font-medium justify-center mr-24 ml-3 text-light-700 dark:text-white">
              Selected: <span id="ext-selected-img-count" class="w-[5ch]">1</span>
            </div>
            
            <button class="disabled:!text-opacity-20 cursor-pointer select-none px-2 group-button group/button focus:.outline-none buttonActiveRing buttonHoverOpacity buttonActiveOpacity buttonActiveBackground buttonHoverBackground flex min-w-fit z-0 group-button shrink grow relative items-center justify-center gap-2 font-medium dark:bg-dark-700 bg-light-100 border-light-200/10 text-light-700 border dark:border-dark-600/30 dark:text-dark-100 text-[13px] pl-3 py-2 text-center rounded-md disabled:pointer-events-none">
              Select All
            </button>
       
            <button class="disabled:!text-opacity-20 cursor-pointer select-none px-2 group-button group/button focus:.outline-none buttonActiveRing buttonHoverOpacity buttonActiveOpacity buttonActiveBackground buttonHoverBackground flex z-0 pr-4 group-button shrink grow relative items-center justify-center gap-2 font-medium dark:bg-dark-700 bg-light-100 border-light-200/10 text-light-700 border dark:border-dark-600/30 dark:text-dark-100 text-[13px] pl-3 py-2 text-center rounded-md disabled:pointer-events-auto disabled:cursor-not-allowed">
              Download
            </button>
            
            <button id="ext-close-select-mode-btn" class="disabled:!text-opacity-20 cursor-pointer select-none group-button group/button focus:.outline-none buttonActiveRing buttonHoverOpacity buttonActiveOpacity buttonActiveBackground buttonHoverBackground flex min-w-fit z-0 group-button shrink grow relative items-center justify-center gap-2 font-medium text-light-700 dark:text-dark-100 text-[13px] px-1 py-2 text-center rounded-md disabled:pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" height="18">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
  
        </div>
      </div>
    `
    page.insertAdjacentHTML('beforeend', controlBar)

    const idleMode = document.getElementById("ext-idle-mode")
    const selectMode = document.getElementById("ext-select-mode")
    idleMode.addEventListener('click', () => {
      idleMode.style.display = (idleMode.style.display === 'none') ? '' : 'none'
      selectMode.style.display = (selectMode.style.display === 'none') ? '' : 'none'
    })

    const closeSelectMode = document.getElementById("ext-close-select-mode-btn")
    closeSelectMode.addEventListener('click', () => {
      idleMode.style.display = ''
      selectMode.style.display = 'none'
    })

    overrideImageElement();
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
