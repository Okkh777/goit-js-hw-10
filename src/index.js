import './css/styles.css';
import {fetchCountries} from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const errorRequest = 'https://global.discourse-cdn.com/brave/original/3X/b/2/b25ce7b5ef1396e782cee4f7bbffaefd7f9d3b49.jpeg';
const refs = {
    body: document.querySelector('body'),
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
    
}

refs.countryList.style.listStyle = "none";
refs.countryInfo.style.listStyle = "none";

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
    evt.preventDefault();
    const searchCountries = evt.target.value.trim();
    cleanHtml();
    if (searchCountries !== '') {
        fetchCountries(searchCountries).then(foundData => {
            if (foundData.length > 10) {
                Notiflix.Notify.info(
                    'Too many matches found. Please enter a more specific name.'
                  );
            } else if (foundData.length === 0) {
                Notiflix.Notify.failure('Oops, there is no country with that name');
            } else if (foundData.length >2 && foundData.length <=10 ) {
                return markupCountriesList(foundData);
            } else if (foundData.length === 1) {
                return markupCountryCard(foundData);
            }
        })
        .catch(err => createErrorMessage(err, errorRequest))
    }
}
function markupCountriesList(countries) {
    const markup = countries
    .map(country => {
      return `<li>
            <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="30" hight="20">
            <p>${country.name.official}</p>
        </li>`;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}
function markupCountryCard(countries) {
    const markup = countries
        .map(country => {
          return `<li>
            <img src="${country.flags.svg}" 
                alt="Flag of ${country.name.official}" width="30" hight="20">
            <p>${country.name.official}</p>
            <p>Capital: ${country.capital}</p>
            <p>Population: ${country.population}</p>
            <p>Languages: ${Object.values(country.languages)}</p>
                </li>`;
        })
        .join('');
      refs.countryList.innerHTML = markup;
}
function createErrorMessage(err, img) {
        const markup = `<li>
        <h2>${err}</h2>
        <img src="${img}" alt="${err}" width="300">
    </li>`
    
        refs.countryList.innerHTML = markup;
    }
function cleanHtml() {
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
}