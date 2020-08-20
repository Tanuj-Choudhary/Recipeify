// Global app controller

//All css or style handling
import './styles';
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

import { elements, renderLoader, clearLoader } from './views/utils';

/** Global state of the app
 * Search object
 * Current recipe
 * Shopping list object
 * Liked recipes
 */
const state = {};
window.state = state;

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
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (err) {
      console.log(err);
      alert('Error processing recipe');
    }
  }
};

['hashchange', 'load'].forEach((event) =>
  window.addEventListener(event, ctrlRecipe)
);

/**
 * List Controller
 */
const ctrlList = () => {
  // Create a new list if there is none yet
  if (!state.list) state.list = new List();

  //Add each ingredient to the list
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

//Handing delete and update list item events
elements.shopping.addEventListener('click', (e) => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  //Handle the delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    //Delete from state
    state.list.deleteItem(id);

    //Delete from view
    listView.deleteItem(id);
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

//TESTING
state.likes = new Likes();

const ctrlLike = () => {
  if (!state.likes) state.likes = new Likes();

  const currentId = state.recipe.id;

  // USER has liked current recipe

  if (!state.likes.isLiked(currentId)) {
    //Add like to state
    const newLike = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    //Toggle the like button
    likesView.toggleLikedBtn(true);

    // Add like to UI list
    likesView.renderLike(newLike);
  } else {
    // Remove like from state
    state.likes.deleteLike(currentId);

    // Toggle the like button
    likesView.toggleLikedBtn(false);

    // Remove like from UI list
    likesView.deleteLike(currentId);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//TESTING
likesView.toggleLikeMenu(state.likes.getNumLikes());

//Handling recipe Button clicks
elements.recipe.addEventListener('click', (e) => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsAndIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsAndIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    ctrlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    //Like Controller
    ctrlLike();
  }
});
