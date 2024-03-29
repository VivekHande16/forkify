import View from './View.js';
import icons from 'url:../../img/icons.svg'; //Parcel 2

class PaginationView extends View{
   _parentElement = document.querySelector('.pagination');

   addHandlerClick(handler) {
       this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--inline');
            //console.log(btn);
            if(!btn) return;

            const goToPage = +btn.dataset.goto;
            //console.log(goToPage);
            handler(goToPage);
       })
   }
    
   _generateMarkup() {
        const curPage = this._data.page;
        //console.log(curPage);
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        //console.log(numPages);

        const generatePreviousMarkup = function (){
            return `
                <button data-goto="${curPage - 1 }" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage - 1}</span>
                </button>
            `;

        }

        const generateNextMarkup = function() {
            return `
            <button data-goto="${curPage + 1 }" class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1 }</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;
        }

        //Page 1 and there are other pages
        if(curPage === 1 && numPages > 1) {
            return generateNextMarkup(); 
        }

        //last page
        if(curPage === numPages && numPages > 1) {
            return generatePreviousMarkup();
        }

        //other page
        if(curPage < numPages) {
            const send = generatePreviousMarkup()+ generateNextMarkup();
            return send;
        }

        //Page 1 and there are NO other pages
            return '';   

   }

}

export default new PaginationView();