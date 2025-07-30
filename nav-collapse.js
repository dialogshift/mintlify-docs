// nav-collapse.js - Mintlify Navigation Collapse Feature
// Adds click-to-toggle functionality for navigation groups

(function() {
  'use strict';
  
  // Wait for DOM to be ready
  function initNavCollapse() {
    // Find all navigation group labels
    // Mintlify typically uses specific class names - we'll target common patterns
    const selectors = [
      '.nav-group > .group-label',
      '.sidebar-group > .group-title', 
      '.navigation-group > .group-header',
      '[data-group] > .group-title',
      // Fallback: look for any clickable group headers in navigation
      '.sidebar .group-title',
      '.navigation .group-title'
    ];
    
    let groupLabels = [];
    
    // Try each selector until we find navigation groups
    for (const selector of selectors) {
      groupLabels = document.querySelectorAll(selector);
      if (groupLabels.length > 0) {
        console.log(`[NavCollapse] Found ${groupLabels.length} navigation groups using selector: ${selector}`);
        break;
      }
    }
    
    // If no groups found with standard selectors, try a more generic approach
    if (groupLabels.length === 0) {
      // Look for navigation structures in common Mintlify layouts
      const navContainers = document.querySelectorAll('.sidebar, .navigation, [role="navigation"]');
      navContainers.forEach(nav => {
        const potentialGroups = nav.querySelectorAll('div[class*="group"], section[class*="group"]');
        potentialGroups.forEach(group => {
          const header = group.querySelector('h2, h3, .title, .header, .label');
          if (header && group.children.length > 1) {
            groupLabels = [...groupLabels, header];
          }
        });
      });
    }
    
    if (groupLabels.length === 0) {
      console.warn('[NavCollapse] No navigation groups found. The sidebar structure might be different than expected.');
      return;
    }
    
    // Process each group label
    groupLabels.forEach((label, index) => {
      // Make sure the label is clickable
      label.style.cursor = 'pointer';
      label.style.userSelect = 'none';
      
      // Add visual indicator (chevron)
      if (!label.querySelector('.collapse-icon')) {
        const icon = document.createElement('span');
        icon.className = 'collapse-icon';
        icon.innerHTML = '▼'; // Down arrow when expanded
        icon.style.cssText = `
          display: inline-block;
          margin-left: 8px;
          transition: transform 0.2s ease;
          font-size: 0.8em;
          opacity: 0.7;
        `;
        label.appendChild(icon);
      }
      
      // Find the content panel (next sibling or specific child)
      let panel = label.nextElementSibling;
      
      // If no next sibling, look for common navigation list patterns
      if (!panel) {
        const parent = label.parentElement;
        panel = parent.querySelector('ul, ol, .nav-links, .group-links, .links');
      }
      
      if (!panel) {
        console.warn(`[NavCollapse] No collapsible panel found for group: ${label.textContent}`);
        return;
      }
      
      // Generate a unique key for sessionStorage
      const groupText = label.textContent.trim().replace(/\s+/g, '-').toLowerCase();
      const key = `nav-collapsed-${groupText}-${index}`;
      
      // Initialize collapse state from sessionStorage
      const isCollapsed = sessionStorage.getItem(key) === 'true';
      if (isCollapsed) {
        panel.classList.add('nav-hidden');
        const icon = label.querySelector('.collapse-icon');
        if (icon) {
          icon.style.transform = 'rotate(-90deg)'; // Right arrow when collapsed
        }
      }
      
      // Add click handler
      label.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isNowCollapsed = panel.classList.toggle('nav-hidden');
        const icon = label.querySelector('.collapse-icon');
        
        // Update icon rotation
        if (icon) {
          icon.style.transform = isNowCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)';
        }
        
        // Save state to sessionStorage
        sessionStorage.setItem(key, isNowCollapsed.toString());
        
        console.log(`[NavCollapse] Toggled group "${groupText}": ${isNowCollapsed ? 'collapsed' : 'expanded'}`);
      });
      
      console.log(`[NavCollapse] Initialized group: ${groupText}`);
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavCollapse);
  } else {
    initNavCollapse();
  }
  
  // Re-initialize on navigation changes (for SPA behavior)
  let lastPathname = window.location.pathname;
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== lastPathname) {
      lastPathname = window.location.pathname;
      setTimeout(initNavCollapse, 100); // Small delay to ensure new content is rendered
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log('[NavCollapse] Navigation collapse script loaded');
})(); 