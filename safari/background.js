import { init } from "./common.js";

// Safari Web Extension entry point.
//
// Unlike Chrome/Firefox, Safari has no standalone native-messaging host: native
// messages are delivered to the extension's containing app
// (SafariWebExtensionHandler in the safari_blocker target), which proxies them
// to the Digital Carrot daemon over gRPC. The host name argument is required by
// the API but effectively ignored by Safari (an extension can only talk to its
// own container), so we pass the extension's bundle id for clarity.
init(browser, {
  nativeHostName: "com.digitalcarrot.DigitalCarrot.macos.Extension",
  browser: "safari",
  transport: "sendNativeMessage",
});
