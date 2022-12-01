import axios from 'axios';
import Notiflix from 'notiflix';

import { refs } from '../refs/refs';
const { form, cardsEl } = refs;

import template from '../../templates/cards.hbs';

import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';

window.addEventListener('load', onLoadPage);
form.addEventListener('submit', onSubmitForm);

class MovieDatabase {
  #BASE_URL = 'https://api.themoviedb.org/3';
  #API_KEY = '2db21389930b520d8ed134be7fb3bbe4';

  #GENRES_URL = 'https://api.themoviedb.org/3/genre/movie/list';
  #TRENDING_URL = 'https://api.themoviedb.org/3/trending/movie/week';
  #IMG_URL = 'https://image.tmdb.org/t/p/w500';
  #SEARCH_URL = 'https://api.themoviedb.org/3/search/movie';

  constructor() {
    this.page = 1;
    this.totalPages = null;

    this.searchValue = null;
    this.previousSearchValue = null;

    this.films = null;
    this.allGenres = null;

    this.query = null;
  }

  clearGallery() {
    cardsEl.innerHTML = '';
  }

  async fetchGenres() {
    try {
      const data = await axios.get(
        `${this.#GENRES_URL}?api_key=${this.#API_KEY}`
      );
      this.allGenres = data.data.genres;

      return this.allGenres;
    } catch (error) {
      console.error(error);
    }
  }
  async fetchTrendingFilms(page) {
    try {
      const data = await axios.get(
        `${this.#TRENDING_URL}?api_key=${this.#API_KEY}&page=${page}`
      );

      this.page = data.data.page;
      this.totalPages = data.data.total_pages;
      this.films = data.data.results;

      return data.data;
    } catch (error) {
      console.error(error);
    }
  }

  async fetchFilms(page) {
    try {
      const data = await axios.get(
        `${this.#SEARCH_URL}?api_key=${this.#API_KEY}&query=${
          this.query
        }&page=${page}`
      );

      if (data.data.results.length) {
        this.page = data.data.page;
        this.totalPages = data.data.total_pages;
        this.films = data.data.results;
      }

      return data.data;
    } catch (error) {
      console.error(error);
    }
  }

  createCardsMarkup(data) {
    const objMarkup = data.map(el => {
      const obj = {
        id: el.id,
        poster_path: `${
          (this.#IMG_URL, el.poster_path ?? '/hKFiWRygxSvnR7Axv1mFcxwpp2b.jpg')
        }`,
        title: el.title,
        vote_average: el.vote_average,
      };

      if (!el.release_date) {
        obj.release_date = '----';
      } else {
        obj.release_date = el.release_date.slice(0, 4);
      }

      if (!el.genre_ids.length) {
        obj.genre_ids = '----';
      } else {
        const genres = el.genre_ids
          .map(
            genreId => this.allGenres.find(genre => genre.id === genreId).name
          )
          .slice(0, 2);
        if (el.genre_ids.length >= 3) {
          genres.push('Other');
        }
        obj.genre_ids = genres.join(', ');
      }

      return obj;
    });
    return objMarkup;
  }
}

const movieDatabase = new MovieDatabase();

async function onSubmitForm(event) {
  event.preventDefault();

  const query = event.target.formInput.value.trim();
  movieDatabase.query = query;

  event.target.formInput.value = '';

  if (!query) {
    Notiflix.Notify.info('Введите что-то');
    return;
  }
  pagination.off('afterMove', loadMoreTrendingFilms);
  pagination.off('afterMove', loadMoreByQuery);
  try {
    const data = await movieDatabase.fetchFilms(page);

    if (data.results.length) {
      movieDatabase.clearGallery();
      pagination.reset(data.total_results);
      pagination.on('afterMove', loadMoreByQuery);
      console.log(data);

      const markup = movieDatabase.createCardsMarkup(data.results);
      cardsEl.innerHTML = template(markup);
    } else {
      Notiflix.Notify.info('Такие фильмы найти не удалось!');
    }
  } catch (error) {
    console.log(error);
  }
}
// ПАГИНАЦИЯ

const options = {
  itemsPerPage: 20,
  visiblePages: 4,
  page: 1,
  centerAlign: true,
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
  template: {
    page: '<a href="#" class="tui-page-btn">{{page}}</a>',
    currentPage:
      '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
    moveButton:
      '<a href="#" class="tui-page-btn tui-{{type}}">' +
      '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</a>',
    disabledMoveButton:
      '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
      '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</span>',
    moreButton:
      '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
      '<span class="tui-ico-ellip">...</span>' +
      '</a>',
  },
};

const container = document.getElementById('pagination');

const pagination = new Pagination(container, options);

const page = pagination.getCurrentPage();

async function onLoadPage(event) {
  try {
    await movieDatabase.fetchGenres();
    const data = await movieDatabase.fetchTrendingFilms(page);

    pagination.reset(data.total_results);
    console.log(data);

    const markup = movieDatabase.createCardsMarkup(data.results);
    cardsEl.innerHTML = template(markup);
  } catch (error) {
    console.log(error);
  }
}

async function loadMoreTrendingFilms(event) {
  const currentPage = event.page;
  console.log(currentPage);
  const data = await movieDatabase.fetchTrendingFilms(currentPage);

  const markup = movieDatabase.createCardsMarkup(data.results);
  cardsEl.innerHTML = template(markup);
}

pagination.on('afterMove', loadMoreTrendingFilms);

async function loadMoreByQuery(event) {
  const currentPage = event.page;

  const data = await movieDatabase.fetchFilms(currentPage);
  const markup = movieDatabase.createCardsMarkup(data.results);
  cardsEl.innerHTML = template(markup);
}
