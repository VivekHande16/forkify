import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
//import { getJSON, sendJSON } from './helper.js'
import { AJAX } from './helper.js'

export const state = {
    recipes: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE
    },
    bookmarks: [],
}

const createRecipeObject = function(data) {
    const { recipe } = data.data;
        return {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl:recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
            ...(recipe.key && {key: recipe.key}),
        };
};

export const loadRecipe = async function (id) {
    try {         
         const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
         state.recipes = createRecipeObject(data);
            
            if(state.bookmarks.some(bookmark => bookmark.id === id)) 
                state.recipes.bookmarked = true;
            else state.recipes.bookmarked = false;

            //console.log(recipe);
            //console.log(state.recipes);
    } catch(err) {
        console.error(err);
        throw err;
    }       
};

export const loadSearchResults = async function(query) {
    try {
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
        //console.log(data);

        state.search.results = data.data.recipes.map(res => {
            return {
                id: res.id,
                title: res.title,
                publisher: res.publisher,
                image: res.image_url,
                ...(res.key && {key: res.key})
            }
        });
        state.search.page = 1;

    } catch(err) {
        console.error(err);
        throw err;
    }
}
//loadSearchResults('pizza');

export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage; //0;
    const end = page * state.search.resultsPerPage;        //9;
    return state.search.results.slice(start, end);
}

export const updateServings = function(newServings) {
    state.recipes.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipes.servings;
        //newQt = oldQt * newServings /oldServings;  // 2 * 8 / 4 = 4
    });

    state.recipes.servings = newServings;
}

const persistBookmarks = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const addBookmark = function (recipe) {

    //Add Bookmark
    state.bookmarks.push(recipe);

    //Mark current recipe as bookmark
    if(recipe.id === state.recipes.id) state.recipes.bookmarked = true;

    persistBookmarks();
}

export const deleteBookmark = function (id) {
    //Delete Bookmark
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    //Mark current recipe not as bookmarked
    if(id === state.recipes.id) state.recipes.bookmarked = false;
}

const init = function() {
    const storage = localStorage.getItem('bookmarks');
    if(storage) state.bookmarks = JSON.parse(storage);
}
init();
console.log(state.bookmarks);

const clearBookmarks = function() {
    localStorage.clear('bookmarks');
};
//clearBookmarks();

export const uploadRecipe = async function(newRecipe) {
    try{

    const ingredients = Object.entries(newRecipe).filter(
        entry => entry[0].startsWith('ingredient') &&
        entry[1] !== '').map(ing => {
            //const ingArr = ing[1].replaceAll(' ','').split(',');
            const ingArr = ing[1].split(',').map(el => el.trim());
            if(ingArr.length !== 3) throw new Error('Wrong ingredient format! Please use the correct format: ');

            const [quantity, unit, description] = ingArr;
            return {quantity: quantity ? +quantity : null, unit, description};
        });
    
    const recipe = {
        title: newRecipe.title,
        source_url: newRecipe.sourceUrl,
        image_url: newRecipe.image,
        publisher: newRecipe.publisher,
        cooking_time: +newRecipe.cookingTime,
        servings: +newRecipe.servings,
        ingredients, 

    };
    console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    state.recipes = createRecipeObject(data);
    //console.log(data);
    //console.log(state.recipes);
    addBookmark(state.recipes);

    } catch(err) {
        throw(err);
    }
   
};