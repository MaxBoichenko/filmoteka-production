import axios from 'axios';

import { refs } from '../refs/refs';
const { form, cardsEl } = refs;

import template from '../../templates/cards.hbs';

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
    this.searchInput = null;
    this.allGenres = null;
    this.trendingFilms = null;
  }

  clearGallery() {
    cardsEl.innerHTML = '';
  }

  async fetchTrendingFilms() {
    try {
      const data = await axios.get(
        `${this.#TRENDING_URL}?api_key=${this.#API_KEY}`
      );
      this.trendingFilms = data.data.results;

      return this.trendingFilms;
    } catch (error) {
      console.error(error);
    }
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

  createCardsMarkup(data) {
    const objMarkup = data.map(el => {
      return {
        id: el.id,
        poster_path: `${(this.#IMG_URL, el.poster_path)}`,
        title: el.title,
        vote_average: el.vote_average,
        release_date: el.release_date.slice(0, 4),
        genre_ids: el.genre_ids
          .map(genreId => {
            return this.allGenres.find(genre => genre.id === genreId).name;
          })
          .slice(0, 2),
      };
    });
    return objMarkup;
  }
}

const movieDatabase = new MovieDatabase();

async function onLoadPage(event) {
  await movieDatabase.fetchGenres();
  const data = await movieDatabase.fetchTrendingFilms();

  const markup = movieDatabase.createCardsMarkup(data);
  cardsEl.innerHTML = template(markup);
}

function onSubmitForm(event) {
  event.preventDefault();
}
