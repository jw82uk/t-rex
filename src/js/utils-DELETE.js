/**
 * Limits the rate at which a function can fire.
 * @param {Function} func - The function to execute.
 * @param {number} delay - The wait time in milliseconds.
 */
export function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * Throttles a function to only execute once every 'limit' milliseconds.
 * @param {Function} func - The function to be throttled.
 * @param {number} limit - The time limit in milliseconds.
 * @returns {Function} - The throttled version of the function.
 */
export const throttle = (func, limit) => {
  let inThrottle;

  return function (...args) {
    const context = this;

    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};
