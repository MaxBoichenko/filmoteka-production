import template from '../../templates/cards.hbs';
import modalTemplates from '../../templates/modalFilm.hbs';
import { FILMOTEKA_KEY_WATCHED } from './modal/modal';
import { FILMOTEKA_KEY_QUEUE } from './modal/modal';

import { refs } from '../refs/refs';
import { logger } from 'handlebars';

const {
  cardsEl,
  modalFilm,
  closeModalBtn,
  backdrop,
  modalContainer,
  modalFilmContainer,
} = refs;

const watchedBtn = document.querySelector('.header__watch-btn');
const queueBtn = document.querySelector('.header__queue-btn');

const renderWatched = () => {
  let dataToRender =
    JSON.parse(localStorage.getItem(FILMOTEKA_KEY_WATCHED)) ?? {};
  cardsEl.innerHTML = template(dataToRender);
};
renderWatched();

const renderQueue = () => {
  let dataToRender =
    JSON.parse(localStorage.getItem(FILMOTEKA_KEY_QUEUE)) ?? {};
  cardsEl.insertAdjacentHTML('beforeend', template(dataToRender));
};
renderQueue();

watchedBtn.addEventListener('click', onWatchedBtnClick);
function onWatchedBtnClick() {
  let dataToRender = JSON.parse(localStorage.getItem(FILMOTEKA_KEY_WATCHED));
  cardsEl.innerHTML = template(dataToRender);
  console.log(dataToRender);
}

queueBtn.addEventListener('click', onQueueBtnClick);
function onQueueBtnClick() {
  let dataToRender = JSON.parse(localStorage.getItem(FILMOTEKA_KEY_QUEUE));
  cardsEl.innerHTML = template(dataToRender);
}

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

  const watchedFilms = JSON.parse(localStorage.getItem(FILMOTEKA_KEY_WATCHED));
  const queueFilms = JSON.parse(localStorage.getItem(FILMOTEKA_KEY_QUEUE));
  watchedFilms.some(el => {
    if (el.id === Number(id)) {
      modalContainer.innerHTML = modalTemplates(el);
      watchedFilms.modalFilm = el;
    }
  });

  queueFilms.some(el => {
    if (el.id === Number(id)) {
      modalContainer.innerHTML = modalTemplates(el);
      queueFilms.modalFilm = el;
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
