import icons from 'url:../../img/icons.svg';

export default class view {
  _data;

  render(data) {
    // Load message if no data exists
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    // Render data
    this._data = data;
    const markup = this._generateMarkup();
    this._replaceParentHTML(markup);
  }

  update(data) {
    // Render data
    this._data = data;
    const newMarkup = this._generateMarkup();

    // Can be used as if it was a DOM object (DOM that lives in the memory)
    // Markup strings is converted to DOM node objects
    // Allows for updating of DOM content without loading images again
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const currEl = currElements[i];
      // Look for changes in nodes
      if (newEl.isEqualNode(currEl)) return;

      // Replace if the first child contains text
      if (newEl.firstChild?.nodeValue.trim() !== '') {
        currEl.textContent = newEl.textContent;
      }

      // Update changes in attributes
      Array.from(newEl.attributes).forEach((attr) => {
        // Replace attributes in current element with those in new element
        // Replace the number of servings to the value in data-update-to
        currEl.setAttribute(attr.name, attr.value);
      });
    });
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
        `;

    this._replaceParentHTML(markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
        `;

    this._replaceParentHTML(markup);
  }

  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
        `;

    this._replaceParentHTML(markup);
  }

  _replaceParentHTML(markup) {
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
