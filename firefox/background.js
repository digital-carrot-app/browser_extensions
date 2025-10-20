import { init } from "./common.js";

browser.extension.isAllowedIncognitoAccess().then((isAllowed) => {
  if (!isAllowed) {
    browser.tabs.create({
      active: true,
      url: "https://www.digitalcarrot.app/docs/browser_extensions/firefox/incognito/",
    });
  }
});

init(browser, {
  nativeHostName: "com.digitalcarrot.DigitalCarrot.firefox",
});
