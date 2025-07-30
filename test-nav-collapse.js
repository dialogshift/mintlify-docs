// test-nav-collapse.js - Test script for navigation collapse feature
// Run this in browser console to verify setup

(function testNavCollapse() {
  console.log('🧪 Testing Navigation Collapse Feature...');
  
  // Test 1: Check if script is loaded
  const scriptLoaded = document.querySelector('script[src*="nav-collapse"]') || 
                       window.location.href.includes('nav-collapse') ||
                       document.querySelector('.collapse-icon');
  
  console.log(`✅ Script loaded: ${scriptLoaded ? 'YES' : 'NO'}`);
  
  // Test 2: Check if CSS is loaded  
  const cssLoaded = document.querySelector('link[href*="nav-collapse"]') ||
                    getComputedStyle(document.body).getPropertyValue('--nav-collapse') ||
                    [...document.styleSheets].some(sheet => {
                      try {
                        return [...sheet.cssRules].some(rule => 
                          rule.selectorText && rule.selectorText.includes('nav-hidden')
                        );
                      } catch (e) { return false; }
                    });
  
  console.log(`✅ CSS loaded: ${cssLoaded ? 'YES' : 'NO'}`);
  
  // Test 3: Find navigation groups
  const selectors = [
    '.nav-group > .group-label',
    '.sidebar-group > .group-title', 
    '.navigation-group > .group-header',
    '[data-group] > .group-title',
    '.sidebar .group-title',
    '.navigation .group-title'
  ];
  
  let groupsFound = [];
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      groupsFound.push({ selector, count: elements.length });
    }
  });
  
  console.log(`✅ Navigation groups found:`, groupsFound);
  
  // Test 4: Check for collapse icons
  const collapseIcons = document.querySelectorAll('.collapse-icon');
  console.log(`✅ Collapse icons: ${collapseIcons.length}`);
  
  // Test 5: Check for clickable groups
  const clickableGroups = document.querySelectorAll('[style*="cursor: pointer"]');
  console.log(`✅ Clickable groups: ${clickableGroups.length}`);
  
  // Test 6: Try to simulate a click
  if (clickableGroups.length > 0) {
    console.log('🔄 Testing click functionality...');
    const firstGroup = clickableGroups[0];
    const originalText = firstGroup.textContent;
    
    // Simulate click
    firstGroup.click();
    
    setTimeout(() => {
      const panel = firstGroup.nextElementSibling;
      const isHidden = panel && panel.classList.contains('nav-hidden');
      console.log(`✅ Click test: ${isHidden ? 'COLLAPSED' : 'EXPANDED'}`);
      
      // Click again to restore
      firstGroup.click();
    }, 100);
  }
  
  // Test 7: Check sessionStorage
  const storageKeys = Object.keys(sessionStorage).filter(key => 
    key.startsWith('nav-collapsed-')
  );
  console.log(`✅ SessionStorage keys: ${storageKeys.length}`, storageKeys);
  
  // Summary
  console.log('\n📊 Test Summary:');
  console.log(`• Script: ${scriptLoaded ? '✅' : '❌'}`);
  console.log(`• CSS: ${cssLoaded ? '✅' : '❌'}`);
  console.log(`• Groups: ${groupsFound.length > 0 ? '✅' : '❌'} (${groupsFound.reduce((sum, g) => sum + g.count, 0)} total)`);
  console.log(`• Icons: ${collapseIcons.length > 0 ? '✅' : '❌'}`);
  console.log(`• Clickable: ${clickableGroups.length > 0 ? '✅' : '❌'}`);
  
  if (groupsFound.length === 0) {
    console.log('\n🔍 Debugging: Sidebar structure analysis...');
    const sidebar = document.querySelector('.sidebar, .navigation, [role="navigation"]');
    if (sidebar) {
      console.log('Sidebar found:', sidebar);
      console.log('Sidebar HTML (first 500 chars):', sidebar.innerHTML.substring(0, 500));
      
      // Look for potential group structures
      const potentialGroups = sidebar.querySelectorAll('div, section, ul, li');
      console.log('Potential group elements:', potentialGroups.length);
      
      // Show structure
      const structure = [];
      potentialGroups.forEach((el, i) => {
        if (i < 10) { // Limit output
          structure.push({
            tag: el.tagName,
            class: el.className,
            text: el.textContent.substring(0, 50),
            children: el.children.length
          });
        }
      });
      console.table(structure);
    } else {
      console.log('❌ No sidebar found with common selectors');
    }
  }
  
  console.log('\n🎯 Next Steps:');
  if (!scriptLoaded) console.log('1. Verify nav-collapse.js is loaded');
  if (!cssLoaded) console.log('2. Verify nav-collapse.css is loaded'); 
  if (groupsFound.length === 0) console.log('3. Update selectors in nav-collapse.js');
  if (groupsFound.length > 0 && collapseIcons.length === 0) console.log('4. Check script execution timing');
  
  console.log('\n✅ Test completed!');
})(); 