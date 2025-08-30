'use strict';
(function(){
  const run = () => {
    console.log('=== NAVBAR INIT START ===');
    console.log('Current URL:', window.location.href);
    console.log('Current pathname:', window.location.pathname);
    
    const links = document.querySelectorAll('.navbar .navbar-link');
    console.log('Found navbar links:', links.length);
    
    if (!links.length) {
      console.log('No navbar links found, returning early');
      return;
    }

    // Log all found links
    links.forEach((link, index) => {
      console.log(`Link ${index}:`, {
        text: link.textContent.trim(),
        href: link.getAttribute('href'),
        classes: link.className
      });
    });

    // Simple page detection based on URL
    let currentPage = 'about'; // default
    const path = window.location.pathname;
    
    if (path.includes('resume')) currentPage = 'resume';
    else if (path.includes('portfolio')) currentPage = 'portfolio';
    else if (path.includes('blog')) currentPage = 'blog';
    else if (path.includes('contact')) currentPage = 'contact';
    else currentPage = 'about';
    
    console.log('Detected current page:', currentPage);

    // Set active class
    links.forEach((link, index) => {
      const linkText = link.textContent.trim().toLowerCase();
      const isActive = linkText === currentPage;
      
      // Remove active class from all links first
      link.classList.remove('active');
      
      // Add active class if this is the current page
      if (isActive) {
        link.classList.add('active');
        console.log(`Setting link "${linkText}" as ACTIVE`);
      }
      
      console.log(`Link ${index}: "${linkText}" - Active: ${isActive}`);
    });
    
    console.log('=== NAVBAR INIT END ===');
  };

  // Expose a function so we can run after header is injected
  window.initNavbarActive = run;

  // If header already present, run now
  if (document.querySelector('.navbar')) {
    console.log('Navbar found on page load, running immediately');
    run();
  } else {
    console.log('No navbar found on page load, will run when header is loaded');
  }
})();
