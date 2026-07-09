/**
 * xAPI Tracking
 * Track which tabs have been clicked on, and send the data to an endpoint.
 * Uses Veracity Learning (https://lrs.io/home/) for the endpoint.
 */

function trackTabClick(tabName) {
  // Create a session ID and add it to the session storage property
  const sessionID = sessionStorage.getItem('xapi_session') || Date.now();
  sessionStorage.setItem('xapi_session', sessionID);

  // Clean the given tab name
  const cleanTabId = tabName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

  // Build the xAPI statement structure
  const statement = {
    actor: {
      mbox: `mailto:anonymous-${sessionID}@example.com`,
      name: 'Anonymous Learner',
      objectType: 'Agent',
    },
    verb: {
      id: 'http://id.tincanapi.com/verb/viewed',
      display: { 'en-GB': 'viewed' },
    },
    object: {
      id: `https://jw82uk.github.io/t-rex/#tab/${cleanTabId}`,
      definition: {
        name: { 'en-GB': tabName },
        description: {
          'en-GB': `The ${tabName} tab on the T. rex learning page.`,
        },
      },
      objectType: 'Activity',
    },
  };

  // Send the statement directly to Veracity using the fetch API
  fetch('https://dino-app.lrs.io/xapi/statements', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Experience-API-Version': '1.0.3', // Required xAPI header
      Authorization:
        'Basic ' +
        btoa(
          '2d490a90-526d-4a9f-b3bf-787acad2fc6e:0d5d410f-78a4-40d5-8aaa-e185b86a7768'
        ),
    },
    body: JSON.stringify(statement),
  })
    // Handle the response
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      console.log(`xAPI Statement sent via native fetch for tab: ${tabName}`);
    })
    .catch((error) => {
      console.error('xAPI Error:', error);
    });
}

/**
 * Accessible Tabs
 * This includes:
 *    1. adding an 'is-visited' class to the visited tabs, and
 *    2. xAPI tracking integration
 */

// The number of tab innstances on the page
let instanceCounter = 0;

export function initTabs(containerSelector) {
  // Get the tabs container element, return if it doesn't exist
  const container = document.querySelector(containerSelector);
  if (!container) return;

  // Increment counter
  instanceCounter++;

  // Get the tab elements
  const tabList = container.querySelector('[role="tablist"]');
  const tabs = tabList.querySelectorAll('[role="tab"]');
  const panels = container.querySelectorAll('[role="tabpanel"]');

  // For each tab, dynamically inject unique IDs, ARIA attributes, and handle initial visibility
  tabs.forEach((tab, index) => {
    const uniqueId = `tabs-${instanceCounter}-tab-${index}`;
    const uniquePanelId = `tabs-${instanceCounter}-panel-${index}`;
    const isSelected = tab.getAttribute('aria-selected') === 'true';

    tab.setAttribute('id', uniqueId);
    tab.setAttribute('aria-controls', uniquePanelId);

    if (panels[index]) {
      panels[index].setAttribute('id', uniquePanelId);
      panels[index].setAttribute('aria-labelledby', uniqueId);

      // Hide the panel if its corresponding tab is not the initially selected one
      if (!isSelected) {
        panels[index].setAttribute('hidden', '');
      }
    }

    // Add a visited state class to selected tabs
    if (isSelected) {
      tab.classList.add('is-visited');
    }
  });

  // Handle mouse clicks
  tabList.addEventListener('click', (e) => {
    const clickedTab = e.target.closest('[role="tab"]');
    if (!clickedTab) return;

    switchTab(clickedTab);
  });

  // Handle keyboard navigation
  tabList.addEventListener('keydown', (e) => {
    // Get the current tab
    const currentTab = document.activeElement;
    if (currentTab.getAttribute('role') !== 'tab') return;

    const tabsArray = Array.from(tabs);
    const index = tabsArray.indexOf(currentTab);
    let targetTab = null;

    // Create actions for particular keys
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        targetTab = tabsArray[(index + 1) % tabsArray.length];
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        targetTab =
          tabsArray[(index - 1 + tabsArray.length) % tabsArray.length];
        break;
      case 'Home':
        targetTab = tabsArray[0];
        break;
      case 'End':
        targetTab = tabsArray[tabsArray.length - 1];
        break;
    }

    if (targetTab) {
      e.preventDefault();
      targetTab.focus();
      switchTab(targetTab);
    }
  });

  // Switch the tab
  function switchTab(newTab) {
    const targetPanelId = newTab.getAttribute('aria-controls');
    newTab.classList.add('is-visited');

    // Add appropriate aria and tab index values to tabs
    tabs.forEach((tab) => {
      const isSelected = tab === newTab;
      tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');
    });

    // Hide or unhide panels accordingly
    panels.forEach((panel) => {
      if (panel.getAttribute('id') === targetPanelId) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });

    // xAPI Tracking Integration
    const tabName = newTab.textContent.trim();
    trackTabClick(tabName);
  }
}
