// import { getActiveTabURL } from "./utils.js";

// const addNewBookmark = (bookmarks, bookmark) => {
//   const bookmarkTitleElement = document.createElement("div");
//   const controlsElement = document.createElement("div");
//   const newBookmarkElement = document.createElement("div");

//   bookmarkTitleElement.textContent = bookmark.desc;
//   bookmarkTitleElement.className = "bookmark-title";
//   controlsElement.className = "bookmark-controls";

//   setBookmarkAttributes("play", onPlay, controlsElement);
//   setBookmarkAttributes("delete", onDelete, controlsElement);

//   newBookmarkElement.id = "bookmark-" + bookmark.time;
//   newBookmarkElement.className = "bookmark";
//   newBookmarkElement.setAttribute("timestamp", bookmark.time);

//   newBookmarkElement.appendChild(bookmarkTitleElement);
//   newBookmarkElement.appendChild(controlsElement);
//   bookmarks.appendChild(newBookmarkElement);
// };

// const viewBookmarks = (currentBookmarks=[]) => {
//   const bookmarksElement = document.getElementById("bookmarks");
//   bookmarksElement.innerHTML = "";

//   if (currentBookmarks.length > 0) {
//     for (let i = 0; i < currentBookmarks.length; i++) {
//       const bookmark = currentBookmarks[i];
//       addNewBookmark(bookmarksElement, bookmark);
//     }
//   } else {
//     bookmarksElement.innerHTML = '<i class="row">No bookmarks to show</i>';
//   }

//   return;
// };

// const onPlay = async e => {
//   const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
//   const activeTab = await getActiveTabURL();

//   chrome.tabs.sendMessage(activeTab.id, {
//     type: "PLAY",
//     value: bookmarkTime,
//   });
// };

// const onDelete = async e => {
//   const activeTab = await getActiveTabURL();
//   const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
//   const bookmarkElementToDelete = document.getElementById(
//     "bookmark-" + bookmarkTime
//   );

//   bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);

//   chrome.tabs.sendMessage(activeTab.id, {
//     type: "DELETE",
//     value: bookmarkTime,
//   }, viewBookmarks);
// };

// const setBookmarkAttributes =  (src, eventListener, controlParentElement) => {
//   const controlElement = document.createElement("img");

//   controlElement.src = "assets/" + src + ".png";
//   controlElement.title = src;
//   controlElement.addEventListener("click", eventListener);
//   controlParentElement.appendChild(controlElement);
// };

// document.addEventListener("DOMContentLoaded", async () => {
//   const activeTab = await getActiveTabURL();
//   const queryParameters = activeTab.url.split("?")[1];
//   const urlParameters = new URLSearchParams(queryParameters);

//   const currentVideo = urlParameters.get("v");

//   if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
//     chrome.storage.sync.get([currentVideo], (data) => {
//       const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];

//       viewBookmarks(currentVideoBookmarks);
//     });
//   } else {
//     const container = document.getElementsByClassName("container")[0];

//     container.innerHTML = '<div class="title">CODESMITH</div>';
//   }
// });


chrome.windows.getAll({populate:true}, getAllOpenWindows);

function getAllOpenWindows(winData) {
  let tabCount = {};

  function closeTab(idArray) {
    chrome.tabs.remove(idArray, () => {
      const favIconToRemove = document.getElementById(idArray[0]);
      favIconToRemove.remove();
      console.log(favIconToRemove)
    });
  }
  // chrome.tabs.remove(
  //   tabIds: number | number[],
  //   callback?: function,
  // )

  winData[0].tabs.forEach(tab => {
    if (tabCount[tab.url]) {
      tabCount[tab.url] = [...tabCount[tab.url], tab.id]
    } else {
      tabCount[tab.url] = [tab.id];
    }
    

    if (tabCount[tab.url].length > 1) {
      console.log(tabCount[tab.url])
      const duplicateWrapper = document.createElement('div')
      duplicateWrapper.setAttribute('class', 'dupe-wrapper')

      const closeAllLabel = document.createElement('p');
      closeAllLabel.innerText = "Click to close duplicates";


      const favIcon = document.createElement('img')
      favIcon.setAttribute('src', tab.favIconUrl)
      favIcon.setAttribute('class', 'favicon')
      favIcon.setAttribute('id', tab.id)
      // favIcon.display.style.width = '50px'
      // favIcon.display.style.height = '50px
      favIcon.addEventListener('click', () => closeTab(tabCount[tab.url].slice(1)));

      duplicateWrapper.appendChild(favIcon)
      duplicateWrapper.appendChild(closeAllLabel)

      document.querySelector('.container').appendChild(duplicateWrapper)
      console.log(tab.favIconUrl)
    }
    
  })
  console.log(tabCount)
}