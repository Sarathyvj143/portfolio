// Blog Header JS (optional for interactivity)
// Example: Highlight active link, add mobile menu, etc.

document.addEventListener('DOMContentLoaded', function() {
  // Highlight active link based on current URL
  const links = document.querySelectorAll('.blog-nav-list a');
  links.forEach(link => {
    if (window.location.pathname === link.getAttribute('href')) {
      link.classList.add('active');
    }
  });
});
