// Imports
// import { SETTINGS } from './constants.js';
import { initTabs } from './tabs.js';

document.addEventListener('DOMContentLoaded', () => {
  // Add the 'has-js' class to body
  document.documentElement.classList.replace('no-js', 'has-js');

  // Initialize tabs component
  initTabs('.tabs');
});
