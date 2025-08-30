'use strict';
// Sidebar expand/collapse (mobile)
(function(){
  const sidebar = document.querySelector('[data-sidebar]');
  const sidebarBtn = document.querySelector('[data-sidebar-btn]');
  if (sidebar && sidebarBtn && window.elementToggleFunc) {
    sidebarBtn.addEventListener('click', function(){ window.elementToggleFunc(sidebar); });
  }
})();
