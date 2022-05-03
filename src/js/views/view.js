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
    console.log(message);
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
