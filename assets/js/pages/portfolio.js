'use strict';
(function(){
  const select = document.querySelector('[data-select]');
  const selectItems = document.querySelectorAll('[data-select-item]');
  const selectValue = document.querySelector('[data-selecct-value]');
  const filterBtn = document.querySelectorAll('[data-filter-btn]');
  const filterItems = document.querySelectorAll('[data-filter-item]');

  if (!filterItems.length) return;

  const filterFunc = function (selectedValue) {
    filterItems.forEach(item=>{
      if (selectedValue === 'all' || selectedValue === item.dataset.category) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  };

  if (select) {
    select.addEventListener('click', function(){
      if (window.elementToggleFunc) window.elementToggleFunc(this);
    });
    selectItems.forEach(it=>{
      it.addEventListener('click', function(){
        const val = this.innerText.toLowerCase();
        if (selectValue) selectValue.innerText = this.innerText;
        if (window.elementToggleFunc) window.elementToggleFunc(select);
        filterFunc(val);
      });
    });
  }

  let lastClickedBtn = filterBtn || null;
  filterBtn.forEach(btn=>{
    btn.addEventListener('click', function(){
      const val = this.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = this.innerText;
      filterFunc(val);
      if (lastClickedBtn) lastClickedBtn.classList.remove('active');
      this.classList.add('active');
      lastClickedBtn = this;
    });
  });
})();
