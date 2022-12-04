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

function openModal(id) {
  modalFilm.classList.remove('visually-hidden');
  backdrop.addEventListener('click', closeModal);
  window.addEventListener('keydown', onEscapeKeyDown);
  modalFilmContainer.addEventListener('click', onLibraryBtnClick);

  const film = movieDatabase.films.some(el => {
    if (el.id === Number(id)) {
      modalContainer.innerHTML = template(el);
      movieDatabase.modalFilm = el;
      checkedLocalStorage(el);
    }
  });

  localStorage.getItem(FILMOTEKA_KEY_QUEUE);
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
    if (event.target.classList.contains('js-watched-remove')) {
      let indexFilm = null;
      const arrayWithWatchedFilms = JSON.parse(
        localStorage.getItem(FILMOTEKA_KEY_WATCHED)
      );

      arrayWithWatchedFilms.forEach((element, index) => {
        if (element.id === currentModalFilm.id) {
          indexFilm = index;
        }
      });

      arrayWithWatchedFilms.splice(indexFilm, 1);

      localStorage.setItem(
        FILMOTEKA_KEY_WATCHED,
        JSON.stringify(arrayWithWatchedFilms)
      );
      movieDatabase.watchedBtn.textContent = 'Add to watched';
      movieDatabase.watchedBtn.classList.remove('js-watched-remove');

      return;
    }
    let watchedArray = [];
    const arrayWithWatchedFilms = JSON.parse(
      localStorage.getItem(FILMOTEKA_KEY_WATCHED)
    );

    if (arrayWithWatchedFilms) {
      watchedArray = watchedArray.concat(arrayWithWatchedFilms);
    }

    movieDatabase.watchedBtn.textContent = 'Remove from watched';
    movieDatabase.watchedBtn.classList.add('js-watched-remove');

    watchedArray.push(currentModalFilm);
    localStorage.setItem(FILMOTEKA_KEY_WATCHED, JSON.stringify(watchedArray));
  }

  if (event.target.classList.contains('js-queue')) {
    if (event.target.classList.contains('js-queue-remove')) {
      let indexFilm = null;
      const arrayWithQueueFilms = JSON.parse(
        localStorage.getItem(FILMOTEKA_KEY_QUEUE)
      );

      arrayWithQueueFilms.forEach((element, index) => {
        if (element.id === currentModalFilm.id) {
          indexFilm = index;
        }
      });

      arrayWithQueueFilms.splice(indexFilm, 1);

      localStorage.setItem(
        FILMOTEKA_KEY_QUEUE,
        JSON.stringify(arrayWithQueueFilms)
      );
      movieDatabase.queueBtn.textContent = 'Add to queue';
      movieDatabase.queueBtn.classList.remove('js-queue-remove');

      return;
    }
    let queueArray = [];
    const arrayWithQueueFilms = JSON.parse(
      localStorage.getItem(FILMOTEKA_KEY_QUEUE)
    );

    if (arrayWithQueueFilms) {
      queueArray = queueArray.concat(arrayWithQueueFilms);
    }

    movieDatabase.queueBtn.textContent = 'Remove from queue';
    movieDatabase.queueBtn.classList.add('js-queue-remove');

    queueArray.push(currentModalFilm);
    localStorage.setItem(FILMOTEKA_KEY_QUEUE, JSON.stringify(queueArray));
  }
}

function checkedLocalStorage(el) {
  const arrayWatched = localStorage.getItem(FILMOTEKA_KEY_WATCHED);

  let watchedBtn = document.querySelector('.js-watched');

  movieDatabase.watchedBtn = watchedBtn;

  if (arrayWatched) {
    JSON.parse(arrayWatched).forEach(element => {
      if (element.id === el.id) {
        watchedBtn.textContent = 'Remove from watched';
        watchedBtn.classList.add('js-watched-remove');
      }
    });
  }
  const arrayQueue = localStorage.getItem(FILMOTEKA_KEY_QUEUE);
  let queueBtn = document.querySelector('.js-queue');
  movieDatabase.queueBtn = queueBtn;

  if (arrayQueue) {
    JSON.parse(arrayQueue).forEach(element => {
      if (element.id === el.id) {
        queueBtn.textContent = 'Remove from queue';
        queueBtn.classList.add('js-queue-remove');
      }
    });
  }
}
