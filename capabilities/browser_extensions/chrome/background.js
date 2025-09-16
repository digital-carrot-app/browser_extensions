import { init } from "./common.js";

function start() {
  init(chrome, {
    nativeHostName: "com.digitalcarrot.digitalcarrot.chrome",
    incognitoDocs:
      "https://www.digitalcarrot.app/docs/browser_extensions/google_chrome/incognito/",
  });
}

chrome.runtime.onInstalled.addListener(() => {
  start();
});

chrome.runtime.onStartup.addListener(() => {
  start();
});
