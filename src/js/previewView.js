import view from './views/view';

class previewView extends view {
  _parentElement = '';

  _generateMarkup() {
    const selectedID = window.location.hash.slice(1);

    return this._data.reduce((markup, recipe) => {
      return (markup += `
      <li class="preview">
        <a class="preview__link ${
          // Set selected search result
          selectedID === recipe.id ? 'preview__link--active' : ''
        }" href="#${recipe.id}">
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

export default previewView;
