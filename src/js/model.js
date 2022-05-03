/* eslint-disable no-useless-catch */
import { API_URL, RESULTS_PER_PAGE } from './config';
import { getJSON } from './helper';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
  },
  resultsPerPage: RESULTS_PER_PAGE,
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);

    // Process recipe data
    const { recipe } = data.data;
    state.recipe = {
      cookingTime: recipe.cooking_time,
      id: recipe.id,
      image: recipe.image_url,
      ingredients: recipe.ingredients,
      publisher: recipe.publisher,
      servings: recipe.servings,
      sourceUrl: recipe.source_url,
      title: recipe.title,
    };
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    // Get query results from API
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);

    // Process query results
    state.search.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        image: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  const startIndex = (page - 1) * state.resultsPerPage;
  const endIndex = startIndex + state.resultsPerPage;

  return state.search.results.slice(startIndex, endIndex);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients = state.recipe.ingredients.map((ingredient) => {
    return {
      ...ingredient,
      quantity: (ingredient.quantity * newServings) / state.recipe.servings,
    };
  });

  state.recipe.servings = newServings;
};
