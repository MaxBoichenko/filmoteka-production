import axios from 'axios';

export class MovieDatabase {
  #URL = '';
  #KEY =
    '2db21389930b520d8ed134be7fb3bbe4';
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
