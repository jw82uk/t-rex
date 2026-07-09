/**
 * Initializes a listener to detect when a Spline 3D viewer has fully finished loading.
 * It uses a dual-approach (event listener + Shadow DOM polling) to ensure the callback
 * fires reliably, even if the script executes after the event has already triggered.
 * * @example
 * initSplineListener('my-spline-viewer', () => {
 * // some code
 * });
 * * @param {string} viewerId - The HTML `id` attribute of the `<spline-viewer>` element.
 * @param {Function} callback - The function to execute once the Spline model is verified loaded.
 * @returns {void}
 */
export function initSplineListener(viewerId, callback) {
  const splineViewer = document.getElementById(viewerId);

  // Safety check
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

  // Fail-safe Shadow DOM polling (important for JS modules due to execution timing)
  const checkLoaded = setInterval(() => {
    if (splineViewer.shadowRoot) {
      const loader = splineViewer.shadowRoot.querySelector('#loader');

      // Check if the Spline loading spinner has been removed or hidden
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
