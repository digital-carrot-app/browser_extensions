document.addEventListener("DOMContentLoaded", function () {
  // Extract the blocked URL from the query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const blockedUrl = urlParams.get("blocked");

  if (blockedUrl) {
    document.getElementById("blockedSite").textContent =
      `Finish all your goals in order to access ${blockedUrl}`;
  }
});
