import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model';
import paginationView from './views/paginationView';
import recipeView from './views/recipeView';
import resultsView from './views/resultsView';
import searchView from './views/searchView';

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
    await model.loadRecipe(id);

    const { recipe } = model.state;
    recipeView.render(recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const renderPage = function () {
  // render search results by page number
  const pageContents = model.getSearchResultsPage(model.state.search.page);
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

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
};

init();
