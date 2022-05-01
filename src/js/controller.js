import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model';
import recipeView from './views/recipeView';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return; // page loads without recipe ID

    // loadRecipe returns a promise
    // recipe is stored in model.state.recipe (impure function)
    await model.loadRecipe(id);
    const { recipe } = model.state;

    recipeView.renderSpinner();
    recipeView.render(recipe);
  } catch (err) {
    alert(err);
  }
};

['load', 'hashchange'].forEach((ev) => {
  window.addEventListener(ev, controlRecipes);
});
