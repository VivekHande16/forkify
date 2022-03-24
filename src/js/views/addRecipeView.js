import View from './View.js';
import icons from 'url:../../img/icons.svg'; //Parcel 2

class AddrecipeView extends View{
   _parentElement = document.querySelector('.upload');
   _successMessage = 'Recipe was successfully added.'

   _window = document.querySelector('.add-recipe-window');
   _overlay = document.querySelector('.overlay');
   _btnOpen = document.querySelector('.nav__btn--add-recipe');
   //_btnOpen = document.querySelector('.btn--close-modal');
   _btnClose = document.querySelector('.btn--close-modal');

    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHandlerHideWindow() {
       this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
       this._overlay.addEventListener('click', this.toggleWindow.bind(this));
   }

   addHandlerUpload(handler) {
       this._parentElement.addEventListener('submit', function(e) {
           e.preventDefault();
           const dataArr = [...new FormData(this)];
           const data = Object.fromEntries(dataArr);
           handler(data);
       })
   }

   _generateMarkup() {
   
   }

}

export default new AddrecipeView();