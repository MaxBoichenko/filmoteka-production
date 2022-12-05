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

window.addEventListener('load', onLoadPage);

watchedBtn.addEventListener('click', onWatchedBtnClick);
queueBtn.addEventListener('click', onQueueBtnClick);

async function onLoadPage(event) {
  try {
    await movieDatabase.fetchGenres();
  } catch (error) {
    console.log(error);
  }
  watchedBtn.classList.add('btn-active');

  let dataToRenderOnLoad =
    JSON.parse(localStorage.getItem(FILMOTEKA_KEY_WATCHED)) ?? [];

  let dataQueue = JSON.parse(localStorage.getItem(FILMOTEKA_KEY_QUEUE)) ?? [];

  movieDatabase.films = dataToRenderOnLoad.concat(dataQueue);

  if (dataToRenderOnLoad.length) {
    const markup = movieDatabase.createCardsMarkup(dataToRenderOnLoad);
    cardsEl.innerHTML = template(markup);
    return;
  }
  cardsEl.innerHTML =
    '<h1 class="title-queue">Your queue is empty</h1><img src="https://image.tmdb.org/t/p/w500/wjYOUKIIOEklJJ4xbbQVRN6PRly.jpg"></img>';
}

export function onWatchedBtnClick() {
  let dataToRenderWatched =
    JSON.parse(localStorage.getItem(FILMOTEKA_KEY_WATCHED)) ?? [];

  watchedBtn.classList.add('btn-active');
  queueBtn.classList.remove('btn-active');

  if (!dataToRenderWatched.length) {
    cardsEl.innerHTML =
      '<h1 class="title-queue">Your watched is empty</h1><img src="https://image.tmdb.org/t/p/w500/wjYOUKIIOEklJJ4xbbQVRN6PRly.jpg"></img>';
    return;
  }
  let markupWatched = movieDatabase.createCardsMarkup(dataToRenderWatched);
  cardsEl.innerHTML = template(markupWatched);
}

export function onQueueBtnClick() {
  let dataToRenderQueue =
    JSON.parse(localStorage.getItem(FILMOTEKA_KEY_QUEUE)) ?? [];

  watchedBtn.classList.remove('btn-active');
  queueBtn.classList.add('btn-active');

  if (!dataToRenderQueue.length) {
    cardsEl.innerHTML =
      '<h1 class="title-queue">Your queue is empty</h1><img src="https://image.tmdb.org/t/p/w500/wjYOUKIIOEklJJ4xbbQVRN6PRly.jpg"></img>';
    return;
  }

  const markupQueue = movieDatabase.createCardsMarkup(dataToRenderQueue);
  cardsEl.innerHTML = template(markupQueue);
}
