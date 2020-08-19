// Global app controller

//All css or style handling
import './styles';
import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/utils';

/** Global state of the app
 * Search object
 * Current recipe
 * Shopping list object
 * Liked recipes
 */
const state = {};

const ctrlSearch = async () => {
  // 1) Get query from the view
  const query = searchView.getInput(); //TODO

  if (query) {
    // 2) New Search object and add it to state
    state.search = new Search(query);

    // 3) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    // 4) Search for recipes
    await state.search.getRecipes();

    // 5) Render the result on UI
    clearLoader();
    searchView.renderRecipes(state.search.recipes);
  }
};

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  ctrlSearch();
});

elements.searchRecPages.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = btn.dataset.goto * 1;
    searchView.clearResults();
    searchView.renderRecipes(state.search.recipes, goToPage);
  }
});
