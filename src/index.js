import './sass/main.scss';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const refs = {
  searchForm: document.querySelector('form#search-form'),
  articlesContainer: document.querySelector('.js-articles-container'),
};

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  const options = {
    headers: {
      Authorization: '25774072-c5897649f594e9daa0e2ccc0a',
    },
  };
  const url = '';
}

fetch('https://pixabay.com/api/?key=cat&language=en&per_page=30', options)
  .then(r => r.json())
  .then(console.log);
