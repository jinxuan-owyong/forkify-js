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
  bookmarks: [],
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

    // Check if loaded recipe is already in bookmarks
    state.recipe.bookmarked = state.bookmarks.some(
      (bookmark) => bookmark.id === id
    );
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

    // Reset to first page
    state.search.page = 1;
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

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
};

export const removeBookmark = function (id) {
  //Remove bookmark
  const idx = state.bookmarks.findIndex((bookmark) => bookmark.id === id);
  state.bookmarks.splice(idx, 1);

  // Mark current recipe as not bookmarked
  state.recipe.bookmarked = false;
};
