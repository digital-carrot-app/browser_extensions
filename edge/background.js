import { init } from "./common.js";

function start() {
  init(chrome, {
    nativeHostName: "com.digitalcarrot.digitalcarrot.edge",
    incognitoDocs:
      "https://www.digitalcarrot.app/docs/browser_extensions/microsoft_edge/incognito/",
  });
}

chrome.runtime.onInstalled.addListener(() => {
  start();
});

chrome.runtime.onStartup.addListener(() => {
  start();
});
