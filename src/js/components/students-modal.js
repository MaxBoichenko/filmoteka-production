const refs = {
  openModalBtn: document.querySelector('[data-modal-open-contacts]'),
  closeModalBtn: document.querySelector('[data-modal-close-contacts]'),
  backdrop: document.querySelector('.backdrop__modal'),
};

refs.openModalBtn.addEventListener('click', onOpenModal);

function onOpenModal() {
  refs.backdrop.classList.remove('is-hidden');
  window.addEventListener('keydown', onEscapeKeyDown);
  refs.backdrop.addEventListener('click', onCloseModal);
}

function onCloseModal(event) {
  if (
    event.target.classList.contains('backdrop__modal') ||
    event.target.classList.contains('modal__close') ||
    event.target.classList.contains('modal__body')
  ) {
    hideModal();
  }
}

function hideModal() {
  refs.backdrop.classList.add('is-hidden');
  refs.backdrop.removeEventListener('click', onCloseModal);
  window.removeEventListener('keydown', onEscapeKeyDown);
}
function onEscapeKeyDown(event) {
  if (event.code === 'Escape') {
    hideModal();
  }
}
