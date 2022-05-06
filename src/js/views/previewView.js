import view from './view';
import icons from 'url:../../img/icons.svg';

class PreviewView extends view {
  _parentElement = '';

  _generateMarkup() {
    const selectedID = window.location.hash.slice(1);

    return this._data.reduce((markup, recipe) => {
      const isSelected = selectedID === recipe.id;
      const previewClass = `preview__link ${
        // Set selected search result
        isSelected ? 'preview__link--active' : ''
      }`;

      const isUserGenerated = recipe.key ?? '';

      return (markup += `
      <li class="preview">
        <a class="${previewClass}" href="#${recipe.id}">
          <figure class="preview__fig">
          <img src="${recipe.image}" alt="${recipe.title}" />
          </figure>
          <div class="preview__data">
          <h4 class="preview__title">${recipe.title}</h4>
          <p class="preview__publisher">${recipe.publisher}</p>
          <div class="preview__user-generated  ${
            isUserGenerated ? '' : 'hidden'
          }">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          </div>
        </a>
      </li>
      `);
    }, '');
  }
}

export default PreviewView;
