import {requestImageSource} from './service.js'
import {blockPageChange} from './pokedex.js'

export const pokemonQuantity = 898;

export function getCardsContainer(){
    return document.querySelector('.cards-container');
}

let page = 0;

export function getPageInput(){
    return document.querySelector('#requiredPage');
}

let rows;
let columns;
let cardsPerPage;
let availablePages;

export function getPageInfo(){
    return {availablePages, cardsPerPage, page};
}

export function getCardsPerPage(){
    rows = getComputedStyle(getCardsContainer()).getPropertyValue("grid-template-rows").split(" ").length;
    columns = getComputedStyle(getCardsContainer()).getPropertyValue("grid-template-columns").split(" ").length;
    cardsPerPage = rows*columns; 

    availablePages = Math.ceil(pokemonQuantity/cardsPerPage);
}

export function updateAvailablePages(){
    getPageInput().max=availablePages;

    let pagerIndicator = document.querySelector('#totalPages');
    pagerIndicator.textContent = availablePages;
}

export function preparePageForUpdate(){
    blockPageChange();  
    updatePagerButtonsVisibility();
    removeCards();
    updatePageInputValue();
}

function updatePagerButtonsVisibility(){
    const previousButton = document.querySelector('#previous-page');
    const nextButton = document.querySelector('#next-page');

    if(page===0){
        previousButton.classList.add('not-visible');
    } else if(previousButton.classList.contains('not-visible')){
        previousButton.classList.remove('not-visible');
    }

    if (page===(availablePages-1)) {
        nextButton.classList.add('not-visible');
    } else if(nextButton.classList.contains('not-visible')){
            nextButton.classList.remove('not-visible');
    }
}

function removeCards(){
    let cards = document.querySelectorAll('.card');

    if(cards.length>0){
        cards.forEach(card=>{
            card.remove();
        })
    }
}

export function createCards(response){
    response.forEach( async (pokemon) => {
        if(pokemon.id>pokemonQuantity){
            return;
        }

        let pokemonId = pokemon.id;

        let card = document.createElement('ARTICLE');
        card.classList.add('card');
        card.id= `pokemon-${pokemonId}`;
        
        let name = document.createElement('H2');
        name.appendChild(document.createTextNode(pokemon.name));
        
        let number = document.createElement('P');
        number.appendChild(document.createTextNode(`Nº ${pokemonId}`));
        
        let image = document.createElement('IMG');
        image.alt=`${pokemon.name} Image.`
        image.classList.add('loading');

        let loadingDiv = document.createElement('DIV');
        loadingDiv.classList.add('loading-div');
        
        card.appendChild(name);
        card.appendChild(number);
        card.appendChild(image);
        card.appendChild(loadingDiv);

        getCardsContainer().appendChild(card);

        image.src = await requestImageSource(pokemonId);
        if(image.src){
            image.classList.remove('loading');
            loadingDiv.remove();
        }
    })

    blockPageChange(false);
}

export function updatePageNumber(addition, actualNumber = undefined){
    if(actualNumber || actualNumber===0){
        page=actualNumber;
        return
    }
    page = page + addition;
}

export function updatePageInputValue(n= page+1){
    getPageInput().value = n;
}


export function showWarning(message){
    let warningContainer = document.createElement('DIV');
    warningContainer.classList.add('warning-container');
    let warningP = document.createElement('P');
    let warningText = document.createTextNode(message);

    warningP.appendChild(warningText);
    warningContainer.appendChild(warningP);

    document.querySelector('body').appendChild(warningContainer);

    setTimeout(()=>{
        warningContainer.remove();
    },2000)
}

export function redistributeGrid(){
    let body = document.querySelector('body');
    let newColumns = getComputedStyle(getCardsContainer()).getPropertyValue("grid-template-columns").split(" ").length;
    if(newColumns<columns && body.classList.contains('vh-100')){
        body.classList.remove('vh-100');
    } else if(newColumns>=columns && !(body.classList.contains('vh-100'))){
        body.classList.add('vh-100');
    }
}