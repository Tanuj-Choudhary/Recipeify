import { elements } from './utils';

/**
 * If Recipe title is greater than 30 charcters.
 * Adds ... after 30 characters and ignore rest
 * Full word is added or ignored
 */
export const limitRecipeTitle = (title, limit = 30) => {
  const newTitle = [];

  if (title.length > limit) {
    title.split(' ').reduce((acc, curr) => {
      if (acc + curr.length <= limit) {
        newTitle.push(curr);
      }
    }, 0);

    return `${newTitle.join(' ')}...`;
  }
  return title;
};

/**
 * Render a single Recipe
 */
const renderRecipe = ({ recipe }) => {
  const shortenedTitle = limitRecipeTitle(recipe.label);
  const encodedURI = encodeURIComponent(recipe.uri);

  const markup = `<li>
    <a class="results__link" href="#${encodedURI}">
        <figure class="results__fig">
            <img src="${recipe.image}" alt=${recipe.label}>
        </figure>
        <div class="results__data">
            <h4 class="results__name">${shortenedTitle}</h4>
            <p class="results__author">${recipe.source}</p>
        </div>
    </a>
  </li>`;

  elements.searchRecList.insertAdjacentHTML('beforeend', markup);
};

/**
 * Create a button for pagination
 * type = prev || next
 */
const createButton = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto=${
  type === 'prev' ? page - 1 : page + 1
}>
  <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
  <svg class="search__icon">${
    type === 'prev'
      ? '<title>triangle-left</title><path d="M14 5v10l-9-5 9-5z"></path>'
      : '<title>triangle-right</title><path d="M15 10l-9 5v-10l9 5z"></path>'
  }       
    </svg>
</button>`;

/**
 * Render buttons based on page
 */
const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);

  let button;
  if (page === 1 && pages > 1) {
    // Button to go to next page
    button = createButton(page, 'next');
  } else if (page < pages) {
    //Both Buttons
    button = `${createButton(page, 'prev')}${createButton(page, 'next')}`;
  } else if (page === pages && pages > 1) {
    // Button to go to prev page
    button = createButton(page, 'prev');
  }
  elements.searchRecPages.insertAdjacentHTML('afterbegin', button);
};

/**
 * These functions are used by controllers
 */

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
};

export const clearResults = () => {
  elements.searchRecList.innerHTML = '';
  elements.searchRecPages.innerHTML = '';
};

export const renderRecipes = (recipes, page = 1, resPerPage = 10) => {
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);

  //render pagination buttons
  renderButtons(page, recipes.length, resPerPage);
};
