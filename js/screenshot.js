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

export function takeScreenshot(element) {
  // Hide 
  element.style.display = "none";

  setTimeout(() => {
    html2canvas(document.body).then((canvas) => {
      // Restore visibility
      element.style.display = "block";

      // Convert screenshot to image and trigger download
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "screenshot.png";
      link.click();
    });
  }, 100);
}