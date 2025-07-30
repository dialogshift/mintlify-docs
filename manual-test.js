// manual-test.js - Quick test for updated Mintlify selectors
// Copy and paste this into your browser console

console.log('🔍 Testing Updated Mintlify Selectors...');

// Test the new selectors
const selectors = [
  '.sidebar-group-header h5[id="sidebar-title"]',
  '.sidebar-group-header h5',
  'h5[id="sidebar-title"]',
  '.sidebar-group-header',
  '.sidebar-group-header .font-semibold'
];

console.log('\n📋 Selector Test Results:');
selectors.forEach((selector, index) => {
  const elements = document.querySelectorAll(selector);
  console.log(`${index + 1}. "${selector}": ${elements.length} elements`);
  if (elements.length > 0) {
    console.log('   Found:', [...elements].map(el => ({
      tag: el.tagName,
      id: el.id,
      class: el.className,
      text: el.textContent.trim().substring(0, 40)
    })));
  }
});

// Test the Mintlify-specific fallback
console.log('\n🎯 Mintlify Structure Analysis:');
const mintlifyHeaders = document.querySelectorAll('.sidebar-group-header');
console.log(`Found ${mintlifyHeaders.length} .sidebar-group-header elements`);

mintlifyHeaders.forEach((header, index) => {
  console.log(`\nHeader ${index + 1}:`);
  console.log('  Element:', header);
  console.log('  Classes:', header.className);
  console.log('  Text:', header.textContent.trim().substring(0, 50));
  
  const h5 = header.querySelector('h5');
  if (h5) {
    console.log('  H5 found:', {
      id: h5.id,
      text: h5.textContent.trim(),
      classes: h5.className
    });
  }
  
  // Test panel detection
  let panel = header.nextElementSibling;
  console.log('  Next sibling (potential panel):', panel ? {
    tag: panel.tagName,
    classes: panel.className,
    children: panel.children.length
  } : 'None');
});

// Manual collapse test
console.log('\n🧪 Manual Collapse Test:');
if (mintlifyHeaders.length > 0) {
  const firstHeader = mintlifyHeaders[0];
  const h5 = firstHeader.querySelector('h5') || firstHeader;
  
  console.log('Target element:', h5);
  console.log('Target text:', h5.textContent.trim());
  
  // Add click handler manually
  h5.style.cursor = 'pointer';
  h5.style.backgroundColor = 'rgba(0,0,255,0.1)';
  
  const panel = firstHeader.nextElementSibling;
  if (panel) {
    console.log('Panel found:', panel);
    console.log('Try clicking the highlighted header to test collapse!');
    
    h5.onclick = function() {
      const isHidden = panel.style.display === 'none';
      panel.style.display = isHidden ? '' : 'none';
      console.log(`Panel ${isHidden ? 'shown' : 'hidden'}`);
    };
  } else {
    console.log('❌ No panel found for collapse test');
  }
} else {
  console.log('❌ No Mintlify headers found for testing');
}

console.log('\n✅ Manual test complete! Check the results above.');
console.log('💡 If elements were found, the updated script should work.');
console.log('🔄 Refresh the page to reload the nav-collapse.js script with the updates.'); 