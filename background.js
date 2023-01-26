// chrome.tabs.onUpdated.addListener((tabId, tab) => {
//   if (tab.url && tab.url.includes("youtube.com/watch")) {
//     const queryParameters = tab.url.split("?")[1];
//     const urlParameters = new URLSearchParams(queryParameters);

//     chrome.tabs.sendMessage(tabId, {
//       type: "NEW",
//       videoId: urlParameters.get("v"),
//     });
//   }
// });

chrome.windows.getAll({populate:true}, getAllOpenWindows);

function getAllOpenWindows(winData) {
  winData[0].tabs.forEach(tab => {
    console.log(tab.favIconUrl)
  })
}