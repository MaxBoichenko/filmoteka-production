import axios from 'axios';

export class MovieDatabase {
  #URL = '';
  #KEY = '';
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
    // return axios.get(`${this.#URL}`);
  }
}
