import { movieDatabase } from '../../API/fetchService';
import template from '../../../templates/modalFilm.hbs';

import { refs } from '../../refs/refs';
const { cardsEl, modalFilm, closeModalBtn, backdrop, modalContainer } = refs;

cardsEl.addEventListener('click', onGalleryClick);

function onGalleryClick(event) {
  if (!event.target.closest('.gallery__item')) {
    return;
  }
  openModal(event.target.closest('.gallery__item').id);
}

function openModal(id) {
  modalFilm.classList.remove('visually-hidden');
  backdrop.addEventListener('click', closeModal);
  window.addEventListener('keydown', onEscapeKeyDown);

  const film = movieDatabase.films.some(el => {
    if (el.id === Number(id)) {
      modalContainer.innerHTML = template(el);
    }
  });
}

function closeModal(event) {
  if (
    event.target.classList.contains('backdrop') ||
    event.target.classList.contains('modal__close-btn')
  ) {
    hideModal();
  }
}
function hideModal() {
  modalFilm.classList.add('visually-hidden');
  backdrop.removeEventListener('click', closeModal);
  window.removeEventListener('keydown', onEscapeKeyDown);
}
function onEscapeKeyDown(event) {
  if (event.code === 'Escape') {
    hideModal();
  }
}
