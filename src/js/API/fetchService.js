import axios from 'axios';

export class MovieDatabase {
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
    this.modalFilm = null;
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

export const movieDatabase = new MovieDatabase();
