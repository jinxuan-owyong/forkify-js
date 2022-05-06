import view from './view';

class SearchView extends view {
  _parentElement = document.querySelector('.search');

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', (ev) => {
      ev.preventDefault();
      handler();
    });
  }

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._parentElement.querySelector('.search__field').value = '';
    return query;
  }
}

export default new SearchView();
