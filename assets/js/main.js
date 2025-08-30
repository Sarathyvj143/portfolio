'use strict';

// Load header when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, loading header...');
  
  // Load the header component
  loadPartial('#header-mount', '/components/common/header.html', function() {
    console.log('Header loaded, initializing navbar...');
    
    // Add a small delay to ensure DOM is fully updated
    setTimeout(() => {
      // Initialize navbar active states after header is loaded
      if (typeof window.initNavbarActive === 'function') {
        console.log('Calling initNavbarActive...');
        window.initNavbarActive();
      } else {
        console.error('initNavbarActive function not found!');
      }
    }, 100);
  });
}); 