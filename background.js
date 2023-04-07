let HTTPURL = "http://leetcode.com";
let HTTPSURL = "https://leetcode.com";
let CONTENT_SCRIPT = "content_script.js";

let addBlindcode = (tabId, changeInfo, tab) => {
    if (!changeInfo || changeInfo.status !== "complete") return;
    let url = !tab || !tab.url ? '' : tab.url.toLowerCase();
    if (url.substring(0, HTTPURL.length) == HTTPURL || url.substring(0, HTTPSURL.length) == HTTPSURL) {
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            files: [CONTENT_SCRIPT]
        }).then(() => {}).catch(err => {console.error("Error injecting Blindcode: ", err)});
    }
}

chrome.tabs.onCreated.addListener(addBlindcode);
chrome.tabs.onUpdated.addListener(addBlindcode);