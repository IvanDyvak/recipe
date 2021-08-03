import {elements} from './search.js';

export const clearRecipe = () =>{
                    document.onclick = function(e){
                    if(e.target.id == 'overlaySecond'){
                        overlaySecond.innerHTML = '';
                        overlaySecond.style.display = 'none';
                    }
                    if(e.target === elements.recipe){
                        elements.recipe.style.display = 'block';
                    }
                };
};
// elements.recipe.innerHTML = '';
const createIngredient = ingredient =>`
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${ingredient}</div>

    </li>
`;

export const renderRecipe = recipe =>{
    const markup = `
    <div class="recipe">
        <figure class="recipe__fig">
            <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
            <h1 class="recipe__title">
                <span>${recipe.title}</span>
            </h1>
        </figure>

        <div class="recipe__details">
            <div class="recipe__info">
                <i class="far fa-clock recipe__info-icon"></i>
                <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                <span class="recipe__info-text"> minutes</span>
            </div>
            <div class="recipe__info">
                <i class="fas fa-male recipe__info-icon"></i>
                <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                <span class="recipe__info-text"> servings</span>
            </div>
            <div class="recipe__info">
                <i id="heart" class="far fa-heart recipe__info-icon"></i>
                <span class="recipe__info-message" hidden> This recipe is added to the collection below</span>
            </div>
        </div>
            <div class="recipe__info-buttons">
                <button class="btn-tiny btn-decrease">
                    <i class="fa fa-minus-circle"></i>
                </button>
                <button class="btn-tiny btn-increase">
                    <i class="fa fa-plus-circle"></i>
                </button>
            </div>


        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map(el => createIngredient(el)).join('')}
            </ul>

        </div>

        <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
            </p>
            <p class="recipe__directions-text">${recipe.instructions}</p>
            <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                <span>Directions</span>
                <i class="fa fa-caret-right"></i>
            </a>
        </div>
    </div>        
        `;

        const overlay = document.getElementById('overlaySecond');
        overlay.style.display = 'block';
        overlay.insertAdjacentHTML('afterbegin', markup);
        overlay.offsetTop == 0; 
        
}
// elements.recipe.insertAdjacentHTML('afterbegin', markup);
