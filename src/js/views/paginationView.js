import view from './view';
import icons from 'url:../../img/icons.svg';
import { RESULTS_PER_PAGE } from '../config';

class paginationView extends view {
  _parentElement = document.querySelector('.pagination');

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = Number(btn.dataset.goto);
      handler(goToPage);
    });
  }

  _generateMarkup() {
    // const pageContents = model.getSearchResultsPage(2);
    const currentPage = this._data.page;
    const numPages = Math.ceil(this._data.results.length / RESULTS_PER_PAGE);

    // render previous button if not at first page
    const btnPrev =
      currentPage !== 1
        ? `
    <button class="btn--inline pagination__btn--prev" data-goto="${
      currentPage - 1
    }">
    <svg class="search__icon">
    <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${currentPage - 1}</span>
    </button>
    `
        : '';

    // render next button if not at last page
    const btnNext =
      currentPage !== numPages
        ? `
    <button class="btn--inline pagination__btn--next" data-goto="${
      currentPage + 1
    }">
      <span>Page ${currentPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    `
        : '';

    return btnPrev + btnNext;
  }
}

export default new paginationView();
