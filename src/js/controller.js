import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model';
import paginationView from './views/paginationView';
import recipeView from './views/recipeView';
import resultsView from './views/resultsView';
import searchView from './views/searchView';
import bookmarksView from './bookmarksView';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return; // page loads without recipe ID

    // loadRecipe returns a promise
    // recipe is stored in model.state.recipe (impure function)
    recipeView.renderSpinner();

    // Update results to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);
    const { recipe } = model.state;

    recipeView.render(recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const renderPage = function () {
  // render search results by page number
  const pageContents = model.getSearchResultsPage();
  resultsView.render(pageContents);

  // render initial pagination buttons
  paginationView.render(model.state.search);
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    // search results stored in model.state.search.results
    resultsView.renderSpinner();
    await model.loadSearchResults(query);

    renderPage();
  } catch (err) {
    resultsView.renderError();
  }
};

const controlPagination = function (page) {
  model.state.search.page = page;
  renderPage();
};

const controlServings = function (numServings) {
  if (numServings < 1) return;
  // update recipe servings
  model.updateServings(numServings);
  // update recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks list
  bookmarksView.render(model.state.bookmarks);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
};

init();
