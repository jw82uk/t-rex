// Imports
// import { SETTINGS } from './constants.js';
import { initTabs } from './tabs.js';

document.addEventListener('DOMContentLoaded', () => {
  // Add the 'has-js' class to body
  document.documentElement.classList.replace('no-js', 'has-js');

  // Initialize tabs component
  initTabs('.tabs');

  // Toggle animation button
  const toggleBtn = document.getElementById('animation-toggle');

  // Add the click event listener
  toggleBtn.addEventListener('click', () => {
    // 1 & 2. Toggle the classes on the body and the button
    document.body.classList.toggle('animation-stopped');
    toggleBtn.classList.toggle('is-stopped');

    // 3. Update the text based on whether the class is now present
    if (toggleBtn.classList.contains('is-stopped')) {
      toggleBtn.textContent = 'Start animation';
    } else {
      toggleBtn.textContent = 'Stop animation';
    }
  });
});
