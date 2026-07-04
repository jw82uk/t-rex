export function initSplineListener(viewerId, callback) {
  const splineViewer = document.getElementById(viewerId);

  if (!splineViewer) {
    console.warn(`Spline viewer with ID "${viewerId}" not found.`);
    return;
  }

  let isTriggered = false;

  // Helper to ensure the callback only runs once
  const handleLoad = () => {
    if (isTriggered) return;
    isTriggered = true;
    clearInterval(checkLoaded);
    callback();
  };

  // Listen for the official load complete event
  splineViewer.addEventListener('load-complete', handleLoad);

  // Fail-safe Shadow DOM polling (crucial for modules due to execution timing)
  const checkLoaded = setInterval(() => {
    if (splineViewer.shadowRoot) {
      const loader = splineViewer.shadowRoot.querySelector('#loader');

      if (
        !loader ||
        loader.style.display === 'none' ||
        window.getComputedStyle(loader).display === 'none'
      ) {
        console.log('Spline model verified loaded via shadow DOM check.');
        handleLoad();
      }
    }
  }, 100);

  // Clear interval after 10 seconds to avoid memory leaks
  setTimeout(() => clearInterval(checkLoaded), 10000);
}
