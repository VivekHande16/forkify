import * as model from './model.js';
import { MODAL_CLOSE_SEC } from  './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import bookmarksView from './views/booksmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
//console.log(Fraction);

//import icons from '../img/icons.svg'; //Parcel 1
import 'core-js/stable';
import 'regenerator-runtime/runtime';

if(module.hot){
  module.hot.accept();
}

const recipeContainer = document.querySelector('.recipe');

const controlRecipe = async function() {
  try {

    const id = window.location.hash.slice(1);
    //console.log(id);

    if(!id) return;
    recipeView.renderSpinner();

    //Update  results view to mark serlected search results
    resultView.update(model.getSearchResultsPage());
    
    //Loading Recipe
    await model.loadRecipe(id);
    
    //Rendering Recipe
    recipeView.render(model.state.recipes);

    //Updating Bookmarks View
    bookmarksView.update(model.state.bookmarks);

    
  } catch (err) {
      //alert(err);
      recipeView.renderError();
      console.error(err);
  }
};
//controlRecipe();

const controlSearchResults = async function() {
  try {
    resultView.renderSpinner();
    //console.log(resultView);

    //get search query
    const query = searchView.getQuery();
    if(!query) return;

  //Load Search results
    await model.loadSearchResults(query);

    //Render results in console
    //console.log(model.state.search.results);
    //resultView.render(model.state.search.results);
    resultView.render(model.getSearchResultsPage(1));

    //Render initial pagination button
    paginationView.render(model.state.search);

  } catch(err) {
    console.log(err);
  }
}

const controlPagination = function(goToPage) {
  //console.log(goToPage);
  //Render new results
  resultView.render(model.getSearchResultsPage(goToPage));

  //Render new pagination button
  paginationView.render(model.state.search);
}

const controlServings = function(newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);

  //update the recipe view
  //recipeView.render(model.state.recipes);
  recipeView.update(model.state.recipes);
}

const controlAddBookmark = function() {
  //Add/remove Bookmark
  if(!model.state.recipes.bookmarked) 
    model.addBookmark(model.state.recipes);
  else model.deleteBookmark(model.state.recipes.id);

  //Update recipe view
  recipeView.update(model.state.recipes);

  //Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
  try {
  // Show loading spinner
  addRecipeView.renderSpinner();

  //upload new recipe data
  await model.uploadRecipe(newRecipe);
  console.log(model.state.recipes);

  //Render Recipe
  recipeView.render(model.state.recipes);

  //Success Message
  addRecipeView.renderMessage();

  //render bookmark view
  bookmarksView.render(model.state.bookmarks);

  //change id in URL
  window.history.pushState(null, '', `#${model.state.recipes.id}`);
  
  //Close form window
  setTimeout(function() {
    addRecipeView.toggleWindow()
  }, MODAL_CLOSE_SEC * 1000 )

  } catch(err) {
    console.error('$$$', err);
    addRecipeView.renderError(err.message);

  }
}

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  
}
init();















































