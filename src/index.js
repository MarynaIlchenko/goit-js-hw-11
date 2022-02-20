// import './sass/main.scss';
import './sass/styles.scss';
import galleryCarfTemplate from './templates/gallery-item.hbs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const settings = {
  imagesKey: '25774072-c5897649f594e9daa0e2ccc0a',
  imagesApiUrl: 'https://pixabay.com/api',
};

export default settings;

const per_page = 30;
const parameters = 'image_type=photo&orientation=horizontal&safesearch=true';
const BASE_URL = `${imagesApiUrl}/?key=${imagesKey}&per_page=${per_page}&${parameters}`;

export const getPictures = async (term, page) => {
  try {
    const response = await axios.get(`${BASE_URL}&q=${term}&page=${page}`);
    return await response.data;
  } catch (error) {
    console.log(error);
  }
};

const searchFormRef = document.querySelector('form#search-form');
const articlesContainerRef = document.querySelector('.js-articles-container');
const loadBtnRef = document.querySelector('.load');
let dataInput = '';
let page = 1;
let timerId = null;

searchFormRef.addEventListener('submit', onSearch);
searchFormRef.addEventListener('input', onInput);
loadBtnRef.addEventListener('click', onLoad);
loadBtnRef.hidden = true;

function onSearch(e) {
  e.preventDefault();
  loadBtnRef.hidden = true;
  articlesContainerRef.innerHTML = '';

  if (dataInput !== '') {
    getPictures(dataInput).then(createGalleryWall).catch(noResult);
  }

  page = 1;
}

function onInput(evt) {
  dataInput = evt.target.value.trim();
}

function createGalleryWall(images) {
  clearInterval(timerId);
  if (images.totalHits === 0) {
    noResult(images);
  } else {
    markUp(images);
    loadBtnRef.hidden = false;

    if (images.hits.length < 30) {
      endOfListMessage();
      loadBtnRef.hidden = true;
    }
  }

  if ((page === 1) & (images.totalHits > 0)) {
    responseMessage(images);
  }
}

function markUp(images) {
  images.hits.map(image => {
    articlesContainerRef.insertAdjacentHTML('beforeend', gallery(images));
  });
  let lightbox = new SimpleLightbox('.photo-card a');
  lightbox.on('show.simplelightbox', function () {});
  lightbox.refresh();
}

function onLoad() {
  page += 1;
  getImages(dataInput, page)
    .then(images => {
      createGalleryWall(images);
      smoothScroll();
    })
    .catch(noResult);
}

function smoothScroll() {
  const { height: cardHeight } = galleryRef.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function noResult() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
  );
}

function responseMessage(images) {
  Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
}

function endOfListMessage() {
  timerId = setTimeout(() => {
    Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
  }, 1000);
}
//   const form = e.currentTarget.elements.searchQuery.value;

//   fetch(url, options)
//     .then(r => r.json())
//     .then(console.log);
// }
