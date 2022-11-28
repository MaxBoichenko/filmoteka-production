import axios from 'axios';

export class MovieDatabase {
  #URL = '';
  #KEY =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZGIyMTM4OTkzMGI1MjBkOGVkMTM0YmU3ZmIzYmJlNCIsInN1YiI6IjYzODUyMDhhMjI5YWUyMTU1NDI4OGQ2MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2YsSOLkQJ78tSsPjxpOwl-r1Dv0O8Lg9wU9ZEHc7Tew';
  constructor() {
    this.page = 1;
    this.per_page = 40;
    this.searchInput = null;
  }
  fetchFilms() {
    const searchParams = new URLSearchParams({
      key: this.#KEY,
      q: this.searchInput,
    });
    return axios.get(
      `https://api.themoviedb.org/3/movie/550?api_key=2db21389930b520d8ed134be7fb3bbe4`
    );
  }
}

const movieFetch = new MovieDatabase();
const films = movieFetch
  .fetchFilms()
  .then(data => {
    console.log(data.data.original_title);
  })
  .catch(error => {
    console.log(error);
  });
