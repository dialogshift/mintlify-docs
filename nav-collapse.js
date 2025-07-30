// nav-collapse.js - Mintlify Navigation Collapse Feature
// Adds click-to-toggle functionality for navigation groups

(function() {
  'use strict';
  
  // Wait for DOM to be ready
  function initNavCollapse() {
    // Find all navigation group labels
    // Updated selectors based on actual Mintlify DOM structure
    const selectors = [
      '.sidebar-group-header h5[id="sidebar-title"]', // Main Mintlify structure
      '.sidebar-group-header h5', // Alternative without ID
      'h5[id="sidebar-title"]', // Direct h5 titles
      '.sidebar-group-header', // The header container itself
      '.sidebar-group-header .font-semibold', // Font-semibold titles
      // Fallback selectors
      '.nav-group > .group-label',
      '.sidebar-group > .group-title', 
      '.navigation-group > .group-header',
      '[data-group] > .group-title',
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
      // Look for Mintlify-specific structures first
      const mintlifyHeaders = document.querySelectorAll('.sidebar-group-header');
      if (mintlifyHeaders.length > 0) {
        console.log(`[NavCollapse] Found ${mintlifyHeaders.length} Mintlify group headers`);
        mintlifyHeaders.forEach(header => {
          // Look for h5 within the header, or use the header itself
          const h5 = header.querySelector('h5');
          groupLabels.push(h5 || header);
        });
      } else {
        // Fallback: Look for navigation structures in common layouts
        const navContainers = document.querySelectorAll('.sidebar, .navigation, [role="navigation"]');
        navContainers.forEach(nav => {
          // Look for h5 elements that might be section headers
          const h5Elements = nav.querySelectorAll('h5[id*="sidebar"], h5[class*="title"]');
          if (h5Elements.length > 0) {
            h5Elements.forEach(h5 => groupLabels.push(h5));
          } else {
            // More generic approach
            const potentialGroups = nav.querySelectorAll('div[class*="group"], section[class*="group"]');
            potentialGroups.forEach(group => {
              const header = group.querySelector('h2, h3, h4, h5, .title, .header, .label');
              if (header && group.children.length > 1) {
                groupLabels.push(header);
              }
            });
          }
        });
      }
    }
    
    if (groupLabels.length === 0) {
      console.warn('[NavCollapse] No navigation groups found. The sidebar structure might be different than expected.');
      
      // Debug: Show what we can find in the sidebar
      const sidebar = document.querySelector('.sidebar, [role="navigation"]');
      if (sidebar) {
        console.log('[NavCollapse] Debug: Sidebar found, analyzing structure...');
        console.log('[NavCollapse] Sidebar classes:', sidebar.className);
        
        // Look for any potential group structures
        const allHeaders = sidebar.querySelectorAll('h1, h2, h3, h4, h5, h6');
        console.log(`[NavCollapse] Found ${allHeaders.length} header elements:`, 
          [...allHeaders].map(h => ({ tag: h.tagName, id: h.id, class: h.className, text: h.textContent.trim().substring(0, 30) }))
        );
        
        const groupLikeElements = sidebar.querySelectorAll('[class*="group"], [class*="header"], [class*="title"]');
        console.log(`[NavCollapse] Found ${groupLikeElements.length} group-like elements:`,
          [...groupLikeElements].map(el => ({ tag: el.tagName, class: el.className, text: el.textContent.trim().substring(0, 30) }))
        );
      } else {
        console.log('[NavCollapse] Debug: No sidebar found with common selectors');
      }
      
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
      
      // For Mintlify structure: if label is h5, look for parent's next sibling
      if (!panel && label.tagName === 'H5') {
        const headerContainer = label.closest('.sidebar-group-header');
        if (headerContainer) {
          panel = headerContainer.nextElementSibling;
        }
      }
      
      // If still no panel, look for common navigation list patterns
      if (!panel) {
        const parent = label.parentElement;
        panel = parent.querySelector('ul, ol, .nav-links, .group-links, .links');
        
        // For Mintlify: look for the next sibling of the header container
        if (!panel && parent.classList.contains('sidebar-group-header')) {
          panel = parent.nextElementSibling;
        }
      }
      
      // Alternative: look for ul elements after the current group
      if (!panel) {
        const container = label.closest('div');
        if (container) {
          panel = container.querySelector('ul[id="sidebar-group"]') || 
                  container.nextElementSibling;
        }
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