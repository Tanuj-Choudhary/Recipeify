// Global app controller

//All css or style handling
import './styles';
import Search from './models/Search';

/** Global state of the app
 * Search object
 * Current recipe
 * Shopping list object
 * Liked recipes
 */
const state = {};

const ctrlSearch = async () => {
  // 1) Get query from the view
  const query = 'burger'; //TODO

  if (query) {
    // 2) New Search object and add it to state
    state.search = new Search(query);

    // 3) Prepare UI for results

    // 4) Search for recipes
    await state.search.getRecipes();

    // 5) Render the result on UI
    console.log(state.search.recipes);
  }
};

document.querySelector('.search').addEventListener('submit', (e) => {
  e.preventDefault();
  ctrlSearch();
});
