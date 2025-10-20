import { init } from "./common.js";

function start() {
  init(chrome, {
    nativeHostName: "com.digitalcarrot.digitalcarrot.edge",
  });
}

chrome.runtime.onInstalled.addListener((object) => {
  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.extension.isAllowedIncognitoAccess().then((isAllowed) => {
      if (!isAllowed) {
        chrome.tabs.create({
          active: true,
          url: "https://www.digitalcarrot.app/docs/browser_extensions/microsoft_edge/incognito/",
        });
      }
    });
  }
  start();
});

chrome.runtime.onStartup.addListener(() => {
  start();
});
