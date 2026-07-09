// Imports
import { initTabs } from './tabs.js';
import { initSplineListener } from './spline-loaded.js';

document.addEventListener('DOMContentLoaded', () => {
  //
  // Add the 'has-js' class to body
  //
  document.documentElement.classList.replace('no-js', 'has-js');

  //
  // Initialize tabs component
  //
  initTabs('.tabs');

  //
  // Animation stop/play button
  //
  const toggleBtn = document.getElementById('animation-toggle');

  // Add the click event listener
  toggleBtn.addEventListener('click', () => {
    // Toggle the classes on the body and the button
    document.body.classList.toggle('animation-stopped');
    toggleBtn.classList.toggle('is-stopped');

    // Update the text based on whether the class is now present
    if (toggleBtn.classList.contains('is-stopped')) {
      toggleBtn.textContent = 'Start animation';
    } else {
      toggleBtn.textContent = 'Stop animation';
    }
  });

  //
  // Add class to <body> when model has loaded
  //
  initSplineListener('dino-model', () => {
    document.body.classList.add('spline-loaded');
  });
});
