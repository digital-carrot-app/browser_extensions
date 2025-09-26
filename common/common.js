let RECONNECT_DELAY = 5000; // 5 seconds

let port = null;
let connecting = false;
let disconnectExpected = false;
var updateKey = "";
var hasPagePerms = true;
var browserApi;
var NATIVE_HOST_NAME;

// Handle messages from the native host
function handleNativeMessage(message) {
  if (message.setState != undefined) {
    updateBlockList(message);
  }
}

function updateBlockList(message) {
  browserApi.declarativeNetRequest.getDynamicRules().then((rules) => {
    var toRemove = [];

    for (const rule of rules) {
      toRemove.push(rule.id);
    }

    var toAdd = [];
    if (message.setState.blockedWebsites !== undefined) {
      for (const website of message.setState.blockedWebsites) {
        toAdd.push({
          id: Number(website.id),
          priority: 1,
          action: {
            type: hasPagePerms ? "redirect" : "block",
            redirect: {
              url:
                browserApi.runtime.getURL("blocked.html") +
                "?blocked=" +
                website.displayName,
            },
          },
          condition: {
            urlFilter: website.urlFilter,
            resourceTypes: ["main_frame"],
          },
        });
      }
    }

    browserApi.declarativeNetRequest
      .updateDynamicRules({
        removeRuleIds: toRemove,
        addRules: toAdd,
      })
      .then(() => (updateKey = message.setState.updateKey));
  });
}

// Connect to the native messaging host
function connectToNativeHost() {
  if (port || connecting) return;

  connecting = true;

  try {
    port = browserApi.runtime.connectNative(NATIVE_HOST_NAME);

    port.onMessage.addListener(handleNativeMessage);
    port.onDisconnect.addListener(handleDisconnect);

    connecting = false;
  } catch (error) {
    console.error("Failed to connect to native host:", JSON.stringify(error));
    port = null;
    connecting = false;
    scheduleReconnect();
  }
}

// Schedule a reconnection attempt
function scheduleReconnect() {
  setTimeout(connectToNativeHost, RECONNECT_DELAY);
}

// Handle disconnection from the native messaging host
function handleDisconnect() {
  if (browserApi.runtime.lastError) {
    console.error(
      "Native host disconnected with error:",
      JSON.stringify(browserApi.runtime.lastError),
    );
  } else if (!disconnectExpected) {
    console.log("Native host disconnected unexpectedly");
  }

  port = null;

  if (!disconnectExpected) {
    scheduleReconnect();
  }

  disconnectExpected = false;
}

export function init(apiObj, cfg) {
  NATIVE_HOST_NAME = cfg.nativeHostName;
  browserApi = apiObj;
  browserApi.extension.isAllowedIncognitoAccess().then((isAllowed) => {
    if (!isAllowed) {
      browserApi.tabs.create({
        active: true,
        url: cfg.incognitoDocs,
      });
    }
  });

  setInterval(async () => {
    reportStatus();
  }, 5000);
  connectToNativeHost();
}

async function reportStatus() {
  // This function runs on a regular schedule and reports the status of the
  // browser extension to the Digital Carrot daemon running on the user's PC.
  //
  // - browser: this tells the daemon which browser is reporting the status
  //   update, since Digital Carrot supports all major vendors.
  //
  // - allowedInIncognito, allowedOnAllSites: these two variables allows the
  //   daemon to assess the health of the browser extension. This information
  //   is used to determine if the user is attempting to bypass blocked websites
  //   without accomplishing their daily goals. Permission to run on all sites
  //   is not strictly necesary for content blocking, but it does allow us to
  //   provide a nicer user experience, rather than blocking a website with
  //   no explanation. It is also required in order to collect brower usage
  //   for setting goals.
  //
  // - activeTabs: these are the URLs that the user is currently visiting.
  //   This data is used to set goals around website usage, for example setting
  //   a maximum amount of time that the user is allowed to spend on one site,
  //   or requiring that the user spend a certain amount of time on a website
  //   that they want to encourage time on. In this case, we're just sending all
  //   usage data to the daemon and letting the daemon decide what to do with it
  //   for maintainability purposes, since we have to maintain multiple versions
  //   of this plugin for each browser and they all talk to the same backend.
  //   The user's browser data is only collected for them to set goals. Any time
  //   this data leaves the user's device it will be fully end to end encrypted.
  //   We don't collect or sell any of this data.
  //
  // - updateKey: this tells the backend if the extension needs an updated set
  //   of blocked websites.
  //
  // - userAgent: this is collected so that we know the browser/version for
  //   debugging and troubleshooting purposes. This information isn't shared
  //   unless the user submits a customer support ticket.

  var status = {
    // browser: "firefox",
    allowedInIncognito: true,
    allowedOnAllSites: true,
    activeTabs: [],
    updateKey: updateKey,
    userAgent: navigator.userAgent,
  };

  var hasActiveWindow = false;
  var w = await browserApi.windows.getAll();

  var minimizedWindows = {};

  for (const window of w) {
    if (window.state == "minimized") {
      minimizedWindows[String(window.id)] = true;
    }
    if (window.focused) {
      hasActiveWindow = true;
    }
  }

  var tabs = await browserApi.tabs.query({});

  for (const tab of tabs) {
    if (minimizedWindows[String(tab.windowId)] === true) {
      continue;
    }
    // We are interested in tabs with a url that are active or audible
    if ((tab.audible || tab.active) && tab.url !== undefined) {
      if (tab.audible || hasActiveWindow) {
        status.activeTabs.push({
          url: tab.url,
        });
      }
    }
  }

  status.allowedInIncognito =
    await browserApi.extension.isAllowedIncognitoAccess();

  status.allowedOnAllSites = await browserApi.permissions.contains({
    origins: ["<all_urls>"],
  });

  if (status.allowedOnAllSites != hasPagePerms) {
    status.updateKey = "";
    hasPagePerms = status.allowedOnAllSites;
  }

  if (port != null) {
    port.postMessage({ status: status });
  }
}
