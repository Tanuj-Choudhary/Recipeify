import axios from 'axios';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getRecipes() {
    try {
      const response = await axios.get(
        `https://api.edamam.com/search?q=${this.query}&app_id=${process.env.RECIPE_API_APP_ID}&app_key=${process.env.RECIPE_API_KEY}`
      );
      this.recipes = response.data.hits;
    } catch (err) {
      alert(err);
    }
  }
}
