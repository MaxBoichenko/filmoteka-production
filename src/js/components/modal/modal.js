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
  let voteEl = document.querySelector('.film-vote');
  voteEl.textContent = Number.parseFloat(voteEl.textContent).toFixed(1);

  let popularityEl = document.querySelector('.film-popularity');
  popularityEl.textContent = Number.parseFloat(
    popularityEl.textContent
  ).toFixed(1);

  let filmGenres = document.querySelector('.film-genre');
  let filmGenresEl = document.querySelector('.gallery__film-subscription');
  console.log(filmGenresEl.textContent);
  filmGenres.textContent = filmGenresEl.textContent.split(' ', 1);
  filmGenres.textContent = filmGenres.textContent.slice(0, -1);
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
