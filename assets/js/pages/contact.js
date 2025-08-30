'use strict';
(function(){
  const form = document.querySelector('[data-form]');
  const inputs = document.querySelectorAll('[data-form-input]');
  const formBtn = document.querySelector('[data-form-btn]');
  if (!form || !inputs.length || !formBtn) return;

  const update = () => {
    if (form.checkValidity()) formBtn.removeAttribute('disabled');
    else formBtn.setAttribute('disabled', '');
  };
  inputs.forEach(inp => inp.addEventListener('input', update));
  // initialize state
  update();
})();
