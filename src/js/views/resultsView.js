import previewView from './previewView';

class ResultsView extends previewView {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query :( Please try again!';
  _message = '';
}

export default new ResultsView();
