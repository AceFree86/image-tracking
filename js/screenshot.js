export function loadHtml2Canvas(callback) {
  if (!window.html2canvas) {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    script.onload = callback;
    document.head.appendChild(script);
  } else {
    callback();
  }
}

export function takeScreenshot() {
  console.log("Taking screenshot...");

  const screenshotButton = document.getElementById("screenshotButton");

  // Hide button before taking a screenshot
  screenshotButton.style.display = "none";

  setTimeout(() => {
    html2canvas(document.body).then((canvas) => {
      // Restore button visibility
      screenshotButton.style.display = "block";

      // Convert screenshot to image and trigger download
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "screenshot.png";
      link.click();
    });
  }, 100);
}

export function initScreenshotButton() {
  const screenshotButton = document.getElementById("screenshotButton");
  if (screenshotButton) {
    screenshotButton.addEventListener("click", () => {
      loadHtml2Canvas(takeScreenshot);
    });
  } else {
    console.error("Screenshot button not found!");
  }
}
