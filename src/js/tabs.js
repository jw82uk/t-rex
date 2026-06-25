// tabs.js (Enhanced version)
let instanceCounter = 0; // Tracks how many tab components are on the page

export function initTabs(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  instanceCounter++;
  const tabList = container.querySelector('[role="tablist"]');
  const tabs = tabList.querySelectorAll('[role="tab"]');
  const panels = container.querySelectorAll('[role="tabpanel"]');

  // Dynamically inject unique IDs and ARIA attributes
  tabs.forEach((tab, index) => {
    const uniqueId = `tabs-${instanceCounter}-tab-${index}`;
    const uniquePanelId = `tabs-${instanceCounter}-panel-${index}`;

    tab.setAttribute('id', uniqueId);
    tab.setAttribute('aria-controls', uniquePanelId);

    // Ensure the corresponding panel exists before setting attributes
    if (panels[index]) {
      panels[index].setAttribute('id', uniquePanelId);
      panels[index].setAttribute('aria-labelledby', uniqueId);
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
    const currentTab = document.activeElement;
    if (currentTab.getAttribute('role') !== 'tab') return;

    const tabsArray = Array.from(tabs);
    const index = tabsArray.indexOf(currentTab);
    let targetTab = null;

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

  function switchTab(newTab) {
    const targetPanelId = newTab.getAttribute('aria-controls');

    // Add the visited class to the newly selected tab
    newTab.classList.add('is-visited');

    tabs.forEach((tab) => {
      const isSelected = tab === newTab;
      tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');
    });

    panels.forEach((panel) => {
      if (panel.getAttribute('id') === targetPanelId) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });
  }
}
