import View from './View.js';
import previewView from './previewView.js';

class BookmarksView extends View{
    _errorMessage = 'No booksmarks yet. Find a nice recipe and bookmark it.';
    _successMessage = '';
    _parentElement = document.querySelector('.bookmarks__list');

    addHandlerRender(handler)   {
        window.addEventListener('load', handler);
    }

    _generateMarkup () {
        //console.log(this._data);
        return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
    }
}
export default new BookmarksView();