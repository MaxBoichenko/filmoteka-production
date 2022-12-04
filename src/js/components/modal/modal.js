import { movieDatabase } from '../../API/fetchService';
import template from '../../../templates/modalFilm.hbs';

import { refs } from '../../refs/refs';
import { logger } from 'handlebars';
const {
  cardsEl,
  modalFilm,
  closeModalBtn,
  backdrop,
  modalContainer,
  modalFilmContainer,
} = refs;

const watchedArray = [];
const queueArray = [];
export const FILMOTEKA_KEY_WATCHED = 'filmoteka-watched';
export const FILMOTEKA_KEY_QUEUE = 'filmoteka-queue';

cardsEl.addEventListener('click', onGalleryClick);

function onGalleryClick(event) {
  if (!event.target.closest('.gallery__item')) {
    return;
  }
  openModal(event.target.closest('.gallery__item').id);

  const voteEl = document.querySelector('.film-vote');
  voteEl.textContent = Number.parseFloat(voteEl.textContent).toFixed(1);

  const popularityEl = document.querySelector('.film-popularity');
  popularityEl.textContent = Number.parseFloat(
    popularityEl.textContent
  ).toFixed(1);

  const filmGenres = document.querySelector('.film-genre');
  const filmGenresEl = document.querySelector('.gallery__film-subscription');

  filmGenres.textContent = filmGenresEl.textContent.split(' ', 2);
}

function openModal(id) {
  modalFilm.classList.remove('visually-hidden');
  backdrop.addEventListener('click', closeModal);
  window.addEventListener('keydown', onEscapeKeyDown);
  modalFilmContainer.addEventListener('click', onLibraryBtnClick);
  document.body.style.position = 'fixed';
  const film = movieDatabase.films.some(el => {
    if (el.id === Number(id)) {
      modalContainer.innerHTML = template(el);
      movieDatabase.modalFilm = el;
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
  document.body.style.position = '';
}
function onEscapeKeyDown(event) {
  if (event.code === 'Escape') {
    hideModal();
  }
}

function onLibraryBtnClick(event) {
  if (
    !(
      event.target.classList.contains('js-watched') ||
      event.target.classList.contains('js-queue')
    )
  ) {
    return;
  }
  const currentModalFilm = movieDatabase.modalFilm;
  if (event.target.classList.contains('js-watched')) {
    if (watchedArray.includes(currentModalFilm)) {
      return;
    } else {
      watchedArray.push(currentModalFilm);
      localStorage.setItem(FILMOTEKA_KEY_WATCHED, JSON.stringify(watchedArray));
      document.querySelector('.js-watched').textContent = 'Remove from Watched';
    }
    return;
  }
  if (event.target.classList.contains('js-queue')) {
    if (queueArray.includes(currentModalFilm)) {
      return;
    } else {
      queueArray.push(currentModalFilm);
      localStorage.setItem(FILMOTEKA_KEY_QUEUE, JSON.stringify(queueArray));
      document.querySelector('.js-queue').textContent = 'Remove from Queue';
    }
    return;
  }
}
