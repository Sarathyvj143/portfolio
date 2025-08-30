'use strict';
(function(){
  const items = document.querySelectorAll('[data-testimonials-item]');
  const modalContainer = document.querySelector('[data-modal-container]');
  const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
  const overlay = document.querySelector('[data-overlay]');
  const modalImg = document.querySelector('[data-modal-img]');
  const modalTitle = document.querySelector('[data-modal-title]');
  const modalText = document.querySelector('[data-modal-text]');

  if (!items.length || !modalContainer || !overlay || !modalCloseBtn) return;

  const toggleModal = function(){
    modalContainer.classList.toggle('active');
    overlay.classList.toggle('active');
  };

  items.forEach(item=>{
    item.addEventListener('click', function(){
      const avatar = this.querySelector('[data-testimonials-avatar]');
      const title = this.querySelector('[data-testimonials-title]');
      const text = this.querySelector('[data-testimonials-text]');
      if (avatar && modalImg) { modalImg.src = avatar.src; modalImg.alt = avatar.alt; }
      if (title && modalTitle) { modalTitle.innerHTML = title.innerHTML; }
      if (text && modalText) { modalText.innerHTML = text.innerHTML; }
      toggleModal();
    });
  });

  modalCloseBtn.addEventListener('click', toggleModal);
  overlay.addEventListener('click', toggleModal);
})();
