import template from '../../templates/cards-library.hbs';
import modalTemplates from '../../templates/modalFilm.hbs';
import { FILMOTEKA_KEY_WATCHED } from './modal/modal';
import { FILMOTEKA_KEY_QUEUE } from './modal/modal';

import { movieDatabase } from '../API/fetchService';

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
  watchedBtn.classList.add('btn-active');
  movieDatabase.films = dataToRender;
  onLoadPage();
};
renderWatched();

async function onLoadPage(event) {
  try {
    await movieDatabase.fetchGenres();
  } catch (error) {
    console.log(error);
  }
}

watchedBtn.addEventListener('click', onWatchedBtnClick);
function onWatchedBtnClick() {
  let dataToRender = JSON.parse(localStorage.getItem(FILMOTEKA_KEY_WATCHED));
  const markup = movieDatabase.createCardsMarkup(dataToRender);
  cardsEl.innerHTML = template(markup);
  watchedBtn.classList.add('btn-active');
  queueBtn.classList.remove('btn-active');
}

queueBtn.addEventListener('click', onQueueBtnClick);
function onQueueBtnClick() {
  let dataToRender = JSON.parse(localStorage.getItem(FILMOTEKA_KEY_QUEUE));

  const markup = movieDatabase.createCardsMarkup(dataToRender);
  cardsEl.innerHTML = template(markup);
  watchedBtn.classList.remove('btn-active');
  queueBtn.classList.add('btn-active');
}

cardsEl.addEventListener('click', onGalleryClick);

function onGalleryClick(event) {
  if (!event.target.closest('.gallery__item-library')) {
    return;
  }
  openModalLib(event.target.closest('.gallery__item-library').id);

  const btnQueueLib = document.querySelector('.js-queue');
  const btnWatchedLib = document.querySelector('.js-watched');
  btnQueueLib.classList.add('visually-hidden');
  btnWatchedLib.classList.add('visually-hidden');

  const voteEl = document.querySelector('.film-vote');
  voteEl.textContent = Number.parseFloat(voteEl.textContent).toFixed(1);

  const popularityEl = document.querySelector('.film-popularity');
  popularityEl.textContent = Number.parseFloat(
    popularityEl.textContent
  ).toFixed(1);

  const filmGenres = document.querySelector('.film-genre');

  if (!movieDatabase.modalFilm.genre_ids.length) {
    filmGenres.textContent = '----';
  } else {
    const genres = movieDatabase.modalFilm.genre_ids.map(
      genreId =>
        movieDatabase.allGenres.find(genre => genre.id === genreId).name
    );

    filmGenres.textContent = genres.join(', ');
  }
}

function openModalLib(id) {
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
