/* eslint-disable no-useless-catch */
import { API_KEY, API_URL, RESULTS_PER_PAGE } from './config';
import { AJAX } from './helper';

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
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);

    // Process recipe data
    state.recipe = createRecipeObject(data);

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
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    // Process query results
    state.search.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        image: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key }),
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

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // Update bookmarks in local storage
  persistBookmarks();
};

export const removeBookmark = function (id) {
  //Remove bookmark
  const idx = state.bookmarks.findIndex((bookmark) => bookmark.id === id);
  state.bookmarks.splice(idx, 1);

  // Mark current recipe as not bookmarked
  state.recipe.bookmarked = false;

  // Update bookmarks in local storage
  persistBookmarks();
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const uploadUserRecipe = async function (newRecipe) {
  try {
    // Process ingredients input from form data
    const ingredients = Object.entries(newRecipe)
      .filter(
        (entry) => entry[0].startsWith('ingredient') && entry[1].trim() !== ''
      )
      .map((ingredient) => {
        const ingArr = ingredient[1].split(',').map((el) => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format: quantity, unit, description'
          );

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // Convert new recipe data to fit API
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // Send user-defined recipe to API
    const uploadURL = `${API_URL}?key=${API_KEY}`;
    const data = await AJAX(uploadURL, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);

    return state.recipe.id;
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const bookmarks = localStorage.getItem('bookmarks');
  if (!bookmarks) return;

  state.bookmarks = JSON.parse(bookmarks);
};

init();
