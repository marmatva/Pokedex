import {preparePageForUpdate, createCards, getPageInput, updatePageNumber, getPageInfo, updatePageInputValue, showWarning} from './mainui.js'
import {requestPokemonsList, requestPokemonDetails, requestTypeDetails} from './storage.js'
import {getOverlay, getPokemonDetailsContainer, pullOutTypeDetails, showPokemonDetails, showTypeDetails} from './overlayui.js'

export async function updatePage(){
    preparePageForUpdate();
    let {cardsPerPage, page} = getPageInfo();
    let response = await requestPokemonsList(cardsPerPage*page, cardsPerPage);
    createCards(response);
}

export function movePage(n){
    if(buttonsBlocked){
        return;
    }
    updatePageNumber(n);
    updatePage();
}

let buttonsBlocked = true; 

export function blockPageChange(x = true){ 
    buttonsBlocked = x;
    getPageInput().disabled = x;
}

export function managePageInput(e){
    let inputValue = e.target.value;
    if(validPageInputValue(inputValue)){
        updatePageNumber(0, inputValue - 1);
        updatePage();
    }
}

function validPageInputValue(inputValue){
    let {availablePages} = getPageInfo();
    if(inputValue<1) {
        updatePageInputValue();
        showWarning('La pagina debe ser igual o meyor a 1');
        return false;
    } else if (inputValue>availablePages){
        updatePageInputValue();
        showWarning(`La pagina debe ser menor o igual a ${availablePages}`);
        return false;
    }
    return true;
}

export function verifyCurrentPage(){
    let {page, cardsPerPage} = getPageInfo();
    let id = parseInt(getOverlay().firstElementChild.id.replace("details-pokemon-",""));
    let correctPage = Math.floor((id-1)/cardsPerPage);
    if(correctPage!==page){
        updatePageNumber(0, correctPage);
        updatePage();
    } 
}

export async function getTypeDetails(e){
    let target = e.target;

    while(target.tagName !== 'BUTTON'){
        target = target.parentElement;
    }

    let id = target.id;
    let response = await requestTypeDetails(id);
    showTypeDetails(response);
}

export async function getSiblingDetails(e){
    let id = getPokemonDetailsContainer().id.replace("details-pokemon-", "");

    if(e.target.classList.contains('next-pokemon') ){
        id++;
    } else{
        id--;
    }
    
    let typeDetails=document.querySelector('.type-details')
    if(typeDetails){
        pullOutTypeDetails();
    }

    let response = await requestPokemonDetails(id);
    showPokemonDetails(response);
}
