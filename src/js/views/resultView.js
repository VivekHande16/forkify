import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; //Parcel 2

class ResultsView extends View{
    _errorMessage = 'No recipies found for your order. Search something different!';
    _successMessage = '';
    _parentElement = document.querySelector('.results');

    _generateMarkup () {
        //console.log(this._data);
        return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
    }

}
export default new ResultsView();