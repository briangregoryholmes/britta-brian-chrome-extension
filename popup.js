chrome.windows.getAll({populate:true}, getAllOpenWindows);

function getAllOpenWindows(winData) {
  let tabCount = {};

  function closeTabs(idArray) {
    chrome.tabs.remove(idArray, () => {
      const favIconToRemove = document.getElementById(idArray[0]);
      favIconToRemove.remove();
    });
  }

  winData[0].tabs.forEach(({url, favIconUrl, id}) => {
    if (tabCount[url]) {
      const openTabsArray = tabCount[url].openTabs;
      tabCount[url].openTabs = [...openTabsArray, id]
    } else {
      tabCount[url] = {"iconUrl": favIconUrl, "openTabs": [id]};
    }
  })

  //Sort tabs button
  const button = document.createElement('button');
  button.innerText = "Sort Tabs";
  button.addEventListener('click', () => sortTabs(winData[0].tabs))
  document.querySelector('.container').appendChild(button); 
  
  function sortTabs(unsorted) {
    //Copy array for readability
    const sortedTabs = [...unsorted]

    //Sort array
    sortedTabs.sort(function (a, b) {
      if (a.url < b.url) {
        return -1;
      }
      if (a.url > b.url) {
        return 1;
      }
      return 0;
    })

    //Move tabs
    sortedTabs.forEach((tabObject, index) => {
      chrome.tabs.move(tabObject.id, {index})
    })
  }

  for (let url in tabCount) {
    const page = tabCount[url];

    if (page.openTabs.length > 1) {
      const duplicateWrapper = document.createElement('div')
      duplicateWrapper.setAttribute('class', 'dupe-wrapper')
      duplicateWrapper.setAttribute('id', page.openTabs[1])

      const openFlag = document.createElement('div')
      const openFlagText = document.createElement('p')
      openFlag.setAttribute('class', 'open-flag')
      openFlagText.innerText = page.openTabs.length - 1 + " EXTRA";
      openFlag.appendChild(openFlagText)

      const favIcon = document.createElement('img')
      favIcon.setAttribute('src', page.iconUrl || 'https://images.emojiterra.com/google/noto-emoji/v2.034/512px/1f37b.png')
      favIcon.setAttribute('class', 'favicon')

      favIcon.addEventListener('click', () => closeTabs(page.openTabs.slice(1)));

      duplicateWrapper.appendChild(favIcon)
      duplicateWrapper.appendChild(openFlag)
      document.querySelector('.icons').appendChild(duplicateWrapper)
    }
  }
}