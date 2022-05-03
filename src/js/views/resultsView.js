import view from './view';

class resultsView extends view {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query :( Please try again!';

  _generateMarkup() {
    return this._data.reduce((markup, recipe) => {
      return (markup += `
      <li class="preview">
        <a class="preview__link" href="#${recipe.id}">
          <figure class="preview__fig">
          <img src="${recipe.image}" alt="${recipe.title}" />
          </figure>
          <div class="preview__data">
          <h4 class="preview__title">${recipe.title}</h4>
          <p class="preview__publisher">${recipe.publisher}</p>
          </div>
        </a>
      </li>
      `);
    }, '');
  }
}

export default new resultsView();
