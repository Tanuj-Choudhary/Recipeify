// Global app controller

//All css or style handling
import './styles';
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/utils';

/** Global state of the app
 * Search object
 * Current recipe
 * Shopping list object
 * Liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
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

/**
 * RECIPE CONTROLLER
 */
const ctrlRecipe = async () => {
  // Get ID from url
  const id = window.location.hash.replace('#', '');

  if (id) {
    //Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    //Highlight selected
    if (state.search) recipeView.highlightSelected(id);

    // Create new recipe object
    state.recipe = new Recipe(id);

    //TESTING
    window.r = state.recipe;

    try {
      // Get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // Calculate serving and time
      state.recipe.calcServings();
      state.recipe.calcTime();

      // Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (err) {
      alert('Error processing recipe');
    }
  }
};

['hashchange', 'load'].forEach((event) =>
  window.addEventListener(event, ctrlRecipe)
);

//Handling recipe Button clicks
elements.recipe.addEventListener('click', (e) => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button is clicked
    state.recipe.updateServings('inc');
  }
  //Update view
  recipeView.updateServingsAndIngredients(state.recipe);
});
