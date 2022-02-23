// import './sass/main.scss';
import './sass/styles.scss';
import gallery from './templates/gallery-item.hbs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getPictures } from './js/api/api-service';

const searchFormRef = document.querySelector('form#search-form');
const galleryRef = document.querySelector('.gallery');
const loadBtnRef = document.querySelector('.load-more');
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
  galleryRef.innerHTML = '';

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

    if (images.hits.length < 40) {
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
    galleryRef.insertAdjacentHTML('beforeend', gallery(image));
  });

  let lightbox = new SimpleLightbox('.photo-card a');
  lightbox.on('show.simplelightbox', function () {});
  lightbox.refresh();
}

function onLoad() {
  page += 1;
  getPictures(dataInput, page)
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
