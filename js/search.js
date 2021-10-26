// import axios from 'axios';
import {app_id, key} from './config.js';
import Recipe from './recipe.js';
import * as recipeView from './recipeView.js';
import * as app from './app.js';

class Search{
	constructor(query){
		this.query = query;
	}

	async getResults(){

	  //   try{
			// const res = await axios(`https://api.edamam.com/search?q=${this.query}&app_id=${app_id}&app_key=${key}&to=30`);
			// console.log(res);
	  //   	this.result = res.data.hits;
	  //   	console.log(this.result);
	  //   }catch(error){
	  //       alert('Something wrong happened');
	  //   }
	 	   

	    try{
			const res = await axios(`https://api.spoonacular.com/recipes/complexSearch?query=${this.query}&addRecipeInformation=true&apiKey=${key}&number=30`);
			this.result = res.data.results;
				console.log(res);

				console.log(this.result);
		    }catch(error){
	        alert('Something wrong happened');
	    }
	}
}
// Global state of the app
// - Search object
// - Current recipe object
// - SHopping list object
// - Likes object

const state = {};

// *********SEARCH CONTROLLER************

const controlSearch = async () =>{
	// 1 Get query from the UI
	const query = getInput();

	if(query){
		// 2 New Search object and add to state
		state.search = new Search(query);
	}
		// 3 Preparing UI for results
		clearInput();
		clearResults();
		renderLoader(elements.searchRes);
		try{
					// 4 Search for recipes
		await state.search.getResults();

		// 5 Render results to UI
		clearLoader();
		renderRecipes(state.search.result);
	}catch(err){
		alert('Please type in your meal');
		clearLoader();
	}

};




export const elements = {
	searchForm: document.querySelector('.search'),
	searchInput: document.querySelector('.search__field'),
	searchResList: document.querySelector('.results_list'),
	searchRes: document.querySelector('.results'),
	searchResPages: document.querySelector('.results_pages'),
	recipe: document.querySelector('.recipe')
};
const elementStrings = {
	loader: 'loader'
};

const renderLoader = parent =>{
	const loader = `
		<div class="${elementStrings.loader}"></div>
	`
parent.insertAdjacentHTML('afterbegin', loader)
};
const clearLoader = () =>{
	const loader = document.querySelector(`.${elementStrings.loader}`);
	if(loader) loader.parentElement.removeChild(loader);
};


const getInput = () => elements.searchInput.value;

const clearInput = () =>{
	elements.searchInput.value = '';
};
const clearResults = () =>{
	elements.searchResList.innerHTML = '';
	elements.searchResPages.innerHTML = '';
}

const limitRecipeTitle = (title, limit = 17) =>{
	const newTitle = [];
	if(title.length > limit){
		title.split(' ').reduce((acc, cur) =>{
			if(acc + cur.length <= limit){
				newTitle.push(cur);
			}
			return acc + cur.length;
		}, 0);
		// return the result		
		return `${newTitle.join(' ')}...`;
	}
	return title;
}

const limitRecipeSummary = (summary, limit = 100) =>{
	const newSummary = [];
	if(summary.length > limit){
		summary.split(' ').reduce((acc, cur) =>{
			if(acc + cur.length <= limit){
				newSummary.push(cur);
			}
			return acc + cur.length;
		}, 0)
		// return the result		
		return `${newSummary.join(' ')}...`;
	}
}

const renderRecipe = (recipe) =>{
	const markup = `
        <li>
          <a class="results__link" href="#${recipe.id}">
            <figure class="results__fig">
              <img src="${recipe.image}" alt="${recipe.title}" />
            </figure>
            <div class="results__data">
              <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
              <p class="results__author">${recipe.sourceName}</p>
              	<div class="results__data__secondary">
				  <p class="results__cookingTime"><i class="far fa-clock"></i> ${recipe.readyInMinutes} min</p>
				  <p class="results__cookingTime">Servings: ${recipe.servings}</p>
				</div>
				<p class="results__summary">${limitRecipeSummary(recipe.summary)}</p>
            </div>
          </a>
        </li>		
	`
	elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

     //    <li>
     //      <a class="results__link" href="${recipe.recipe.uri}">
     //        <figure class="results__fig">
     //          <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}" />
     //        </figure>
     //        <div class="results__data">
     //          <h4 class="results__name">${limitRecipeTitle(recipe.recipe.label)}</h4>
     //          <p class="results__author">${recipe.recipe.source}</p>
			  // <p class="results__calories">Calories: ${Math.round(recipe.recipe.calories)}</p>
     //        </div>
     //      </a>
     //    </li>

            const createButton = (page, type) => {
              // 'type' will be either 'prev' or 'next'
              const goToPage = type === 'prev' ? page - 1 : page + 1;
              return `
                <button class="btn_inline results__btn--${type}" data-goto="${goToPage}">
                     ${type === 'prev' ? '<i class="fa fa-caret-left"></i>' : '<i class="fa fa-caret-right"></i>'}
                     <span>Page ${goToPage}</span>
                </button>
              `;
            };
    
        const renderButtons = (page, numResults, resPerPage) =>{
            const pages = Math.ceil(numResults / resPerPage);
            let button;
                if (page === 1 && pages > 1){
                    button = createButton(page, 'next');
                }else if (page < pages){
                    //both buttons
                    button = `
                        ${createButton(page, 'prev')}
                        ${createButton(page, 'next')}
                    `;
                }else if (page === pages && pages > 1){
                    button = createButton(page, 'prev');
                }
                else if (page === 1){
                    button = '';
                }
    
                document.querySelector(".results_pages").insertAdjacentHTML('afterbegin', button);
        };
    
    
    
        const renderRecipes = (recipes, page = 1, resPerPage = 5) =>{
                const start = (page - 1) * resPerPage;
                const end = page * resPerPage;
                recipes.slice(start, end).forEach(renderRecipe);
    
                //render pagination
                renderButtons (page, recipes.length, resPerPage);
        };
      



elements.searchForm.addEventListener('submit', e=>{
	e.preventDefault();
	controlSearch();
});

elements.searchResPages.addEventListener('click', e =>{
    const btn = e.target.closest('.btn_inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        clearResults();
     	renderRecipes (state.search.result, goToPage);

    }
 });

// *********RECIPE CONTROLLER************

// const r = new Recipe(716429);
// r.getRecipe();
// console.log(r);

const controlRecipe = async () =>{
	const id = window.location.hash.replace('#', '');
	console.log(id);
	if(id) {
		// Prepare UI for changes
		recipeView.clearRecipe();
		// renderLoader(elements.recipe);
		// Create new recipe object
		state.recipe = new Recipe(id);
		//window.r = state.recipe;

		
		try{

		// Get recipe data and parse ingredients
		await state.recipe.getRecipe();
		state.recipe.parseIngredients();

		// Render recipe
		// clearLoader();

		recipeView.renderRecipe(state.recipe);

		//Adding Liked recipe to the collection

		const addLikedRecipe = () =>{
			  const heart = document.getElementById('heart');
			  heart.classList.remove("far");
			  heart.classList.add("fas");

			  setTimeout(function () {
				  const addMessage = document.querySelector('.recipe__info-message');
				  addMessage.hidden = false;
			  }, 1500);


			const newItem = state.recipe.likedRecipe();

			// state.recipe.likedRecipe();

			const createIngredient = ingredient =>`
				<li class="ingItem">
					${ingredient}
				</li>
			`;
			const renderLikedRecipe = recipe =>{
				const  element = document.querySelector('.recipe_container');

				const markup = `
						<div class="item_added clearfix" id="${recipe.id}">
	                        <h4 class="recipe_value">${recipe.name}</h4>
	                        <div class="recipe_ingredients"> <p>INGREDIENTS</p> 
	                            <ul class="ingredient_value">
		                        	${recipe.ingredients.map(el => createIngredient(el)).join('')}
								</ul>
	                        </div>
	                        <div>
	                            <p>HOW TO COOK</p>
	                            <p class="recipe_method">${recipe.process}</p>
	                            <div>
	                            <p class="date"></p>
	                            </div>
	                            <div class="btn_control">                                        <button class="btn btn-info" title="Edit post">
	                                    <i class="far fa-edit"></i>
	                                </button>
	                                <button class="btn btn-danger" title="Delete post">
	                                    <i class="far fa-times-circle btn_delete"></i>
	                                </button>
	                            </div>
	                        <p class="today">Published: ${recipe.year}</p>
	                        </div>
	                    </div>
				`
				element.insertAdjacentHTML('afterbegin', markup);

			}
				renderLikedRecipe(newItem);
	            document.querySelector('.collection_message').hidden = true;
				document.querySelector('.fa-heart').style.pointerEvents = "none";
				const   recipeCollection = JSON.parse(localStorage.getItem('recipes'));

				console.log(recipeCollection);

				const delBtn = document.querySelectorAll('.btn_delete');
                const delArr = Array.prototype.slice.call(delBtn);
                delArr.forEach(function (cur) {
                    cur.addEventListener("click", ctrlDeleteItem);
                })
                const editBtn = document.querySelectorAll('.fa-edit');
                const editArr = Array.prototype.slice.call(editBtn);
                editArr.forEach(function (cur) {
                    cur.addEventListener("click", ctrlEditItem);
                })

            var ctrlDeleteItem = function(event) {
            var ID;

            ID = event.target.parentNode.parentNode.parentNode.parentNode.id;

            // 1. delete the item from the data structure
            recipeCtrl.deleteItem(ID);
    
    
            // 2. Delete the item from the UI
            UICtrl.deleteListItem(ID);

                    function delItem() {
                        var recipeContainer = document.querySelector('.recipe_container');
                        while (recipeContainer.hasChildNodes()) {
                            recipeContainer.removeChild(recipeContainer.firstChild);
                        }
                    }delItem();
                    function delButton() {
                        var recipePagination = document.querySelector('.recipe_pagination');
                        while (recipePagination.hasChildNodes()) {
                            recipePagination.removeChild(recipePagination.firstChild);
                        }
                    }delButton();
            const recipeCollection = JSON.parse(localStorage.getItem('recipes'));
            let page = 1;
            let resPerPage = 2;
            renderResults (recipeCollection, page, resPerPage);
    
        };
             var ctrlEditItem = function(event) {
    
            var ID, newItem;
                                    console.log('clicked');

    
            ID = event.target.parentNode.parentNode.parentNode.parentNode.id;
            console.log(ID);
            newItem = recipeCtrl.editItem(ID);
    
            UICtrl.editListItem(newItem);
    
            document.getElementById('save').addEventListener('click', saveItem);
        };
    
        var saveItem = function (){
    
            var input = UICtrl.getSaveInput();
            recipeCtrl.addSaveItem(input.id, input.name, input.ingredients, input.process);
    
            function delItem() {
                var recipeContainer = document.querySelector('.recipe_container');
                while (recipeContainer.hasChildNodes()) {
                    recipeContainer.removeChild(recipeContainer.firstChild);
                }
            }delItem();
    
            document.getElementById('overlaySecond').style.display = 'none';
            var itemEditForm = document.querySelector('.item_edit_form');
            itemEditForm.parentNode.removeChild(itemEditForm);

            function delButton() {
                var recipePagination = document.querySelector('.recipe_pagination');
                while (recipePagination.hasChildNodes()) {
                recipePagination.removeChild(recipePagination.firstChild);
                }
            }delButton();

            const recipeCollection = JSON.parse(localStorage.getItem('recipes'));
            let page = 1;
            let resPerPage = 2;
            renderResults (recipeCollection, page, resPerPage);
        };

		const renderResults = (recipeCollection, page = 1, resPerPage = 2) =>{
                recipeCollection = JSON.parse(localStorage.getItem('recipes'));
                const start = (page - 1) * resPerPage;
                const end = page * resPerPage;
                recipeCollection.slice(start, end).forEach(renderLikedRecipe);
    
                const delBtn = document.querySelectorAll('.btn_delete');
                const delArr = Array.prototype.slice.call(delBtn);
                delArr.forEach(function (cur) {
                    cur.addEventListener("click", ctrlDeleteItem);
                })
                const editBtn = document.querySelectorAll('.fa-edit');
                const editArr = Array.prototype.slice.call(editBtn);
                editArr.forEach(function (cur) {
                    cur.addEventListener("click", ctrlEditItem);
                })
                //render pagination
                renderButtons (page, recipeCollection.length, resPerPage);
        };
      
        document.querySelector(".recipe_pagination").addEventListener('click', e =>{
                const btn = e.target.closest('.btn_inline');
                if (btn) {
                    const goToPage = parseInt(btn.dataset.goto, 10);

                    function delItem() {
                        var recipeContainer = document.querySelector('.recipe_container');
                        while (recipeContainer.hasChildNodes()) {
                            recipeContainer.removeChild(recipeContainer.firstChild);
                        }
                    }delItem();
                    function delButton() {
                        var recipePagination = document.querySelector('.recipe_pagination');
                        while (recipePagination.hasChildNodes()) {
                            recipePagination.removeChild(recipePagination.firstChild);
                        }
                    }delButton();

                        recipeCollection = JSON.parse(localStorage.getItem('recipes'));
                        renderResults (recipeCollection, goToPage);
                }
    
        });
		}

		document.querySelector('.fa-heart').addEventListener('click', addLikedRecipe);

		
		}catch(error){
			alert('Error processing recipe. Please click again');
		}
	}
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

