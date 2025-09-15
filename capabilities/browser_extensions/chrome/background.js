import { init } from "./common.js";

// Constants
const NATIVE_HOST_NAME = "";

init(chrome, {
  nativeHostName: "com.digitalcarrot.digitalcarrot.chrome",
  incognitoDocs:
    "https://www.digitalcarrot.app/docs/browser_extensions/firefox/incognito/",
});
