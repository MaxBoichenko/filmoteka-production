import { movieDatabase } from '../API/fetchService';
import { scrollTo } from '../components/go-to-top';

import template from '../../templates/cards.hbs';
import Notiflix from 'notiflix';
import { spinnerOff, spinnerOn } from '../components/spinner';

import { refs } from '../refs/refs';
const { form, cardsEl } = refs;

import { pagination } from '../components/pagination';
const page = pagination.getCurrentPage();

window.addEventListener('load', onLoadPage);
form.addEventListener('submit', onSubmitForm);

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
    spinnerOn();
    const data = await movieDatabase.fetchFilms(page);
    
    if (data.results.length) {
      spinnerOff();
      pagination.reset(data.total_results);
      pagination.on('afterMove', loadMoreByQuery);

      const markup = movieDatabase.createCardsMarkup(data.results);
      cardsEl.innerHTML = template(markup);
      
       
    } else {
      spinnerOff();
      Notiflix.Notify.info('Такие фильмы найти не удалось!');
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadPage(event) {
  try {
    await movieDatabase.fetchGenres();
    const data = await movieDatabase.fetchTrendingFilms(page);

    pagination.reset(data.total_results);

    const markup = movieDatabase.createCardsMarkup(data.results);
    cardsEl.innerHTML = template(markup);
  } catch (error) {
    console.log(error);
  }
}

async function loadMoreTrendingFilms(event) {
  const currentPage = event.page;
  const data = await movieDatabase.fetchTrendingFilms(currentPage);

  const markup = movieDatabase.createCardsMarkup(data.results);
  cardsEl.innerHTML = template(markup);
  scrollTo(0, 400);
}

pagination.on('afterMove', loadMoreTrendingFilms);

async function loadMoreByQuery(event) {
  const currentPage = event.page;

  const data = await movieDatabase.fetchFilms(currentPage);
  const markup = movieDatabase.createCardsMarkup(data.results);
  cardsEl.innerHTML = template(markup);
  scrollTo(0, 400);
}
