import {getApiInfo, getImageSrc} from './pokeapi.js'
import {overlay} from './overlayui.js'

export const pokemonQuantity = 898;

export const previousButton = document.querySelector('#previous-page');
export const nextButton = document.querySelector('#next-page');

export const cardsContainer = document.querySelector('.cards-container');

let page = 0;

export const pageInput = document.querySelector('#requiredPage');

let rows;
let columns;
let cardsPerPage;
let availablePages;

let buttonsBlocked = true;


export function getCardsPerPage(){
    rows = getComputedStyle(cardsContainer).getPropertyValue("grid-template-rows").split(" ").length;
    columns = getComputedStyle(cardsContainer).getPropertyValue("grid-template-columns").split(" ").length;
    cardsPerPage = rows*columns; 

    availablePages = Math.ceil(pokemonQuantity/cardsPerPage);
}

export function updateAvailablePages(){
    pageInput.max=availablePages;

    let pagerIndicator = document.querySelector('#totalPages');
    pagerIndicator.textContent = availablePages;
}

function updatePagerButtonsVisibility(){
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

export async function updatePage(){
    buttonsBlocked = true;
    pageInput.disabled = true;
    
    updatePagerButtonsVisibility();

    let cards = document.querySelectorAll('.card');

    if(cards.length>0){
        cards.forEach(card=>{
            card.remove();
        })
    }

    pageInput.value=page+1;
    let url = `https://pokeapi.co/api/v2/pokemon/?offset=${cardsPerPage*page}&limit=${cardsPerPage}`
    let response = await getApiInfo(url);
    createCards(response);
}

function createCards(response){
    response.forEach( (pokemon) => {
        let url = pokemon.url;
        let pokemonId = url.replace("https://pokeapi.co/api/v2/pokemon/", "").replace("/", "");
        
        if(pokemonId>pokemonQuantity){
            return;
        }

        let card = document.createElement('ARTICLE');
        card.classList.add('card');
        let id = `pokemon-${pokemonId}`;
        card.id= id;
        
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

        cardsContainer.appendChild(card);

        getImageSrc(url)
            .then(response => {
                image.src= `${response}`;
            })
            .then( () => {
                image.classList.remove('loading');
                loadingDiv.remove();
            })
    })

    buttonsBlocked = false;
    pageInput.disabled = false;
}

export function movePageForward(){
    if(buttonsBlocked){
        return;
    }
    page++;
    updatePage();
}

export function movePageBackwards(){
    if(buttonsBlocked){
        return;
    }
    page--;
    updatePage();
}

export function managePageInput(e){
    if(e.target.value<1) {
        pageInput.value=page+1;
        showWarning('La pagina debe ser igual o meyor a 1');
        return;
    } else if (e.target.value>availablePages){
        pageInput.value=page+1;
        showWarning(`La pagina debe ser menor o igual a ${availablePages}`);
        return;
    }

    page = e.target.value - 1;

    updatePage();
}

export function verifyCurrentPage(){
    let id = parseInt(overlay.firstElementChild.id.replace("details-pokemon-",""));
    let correctPage = Math.floor(id/cardsPerPage);
    if(correctPage!==page){
        page=correctPage;
        updatePage();
    } 
}

function showWarning(message){
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
    let newColumns = getComputedStyle(cardsContainer).getPropertyValue("grid-template-columns").split(" ").length;
    if(newColumns<columns && body.classList.contains('vh-100')){
        body.classList.remove('vh-100');
    } else if(newColumns>=columns && !(body.classList.contains('vh-100'))){
        body.classList.add('vh-100');
    }
}