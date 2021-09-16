import {requestPokemonDetails} from './storage.js'
import {getOverlay, showPokemonDetails} from './overlayui.js'
import {getCardsPerPage, updateAvailablePages, redistributeGrid, getCardsContainer , getPageInput} from './mainui.js'
import {updatePage, movePage, managePageInput, verifyCurrentPage, getSiblingDetails} from './pokedex.js'

window.onresize = redistributeGrid;

document.querySelector('#next-page').onclick=()=>{movePage(1)};
document.querySelector('#previous-page').onclick=()=>{movePage(-1)};

getCardsContainer().onclick= async (e)=>{
    if(!(e.target.tagName === 'SECTION')){
        let target = (e.target.tagName === 'ARTICLE') ? e.target : e.target.parentElement;
        let id = target.id.replace('pokemon-', '');
        let response = await requestPokemonDetails(id);
        showPokemonDetails(response);
    }
}

getPageInput().onchange=managePageInput;

document.querySelector('#previous-pokemon').onclick=getSiblingDetails;
document.querySelector('#next-pokemon').onclick=getSiblingDetails;

document.querySelector('.overlay button').onclick=()=>{
    getOverlay().classList.add('translated');   
    verifyCurrentPage();
}

document.addEventListener('DOMContentLoaded', ()=>{startApp()});


function startApp(){
    getCardsPerPage();
    updateAvailablePages();
    updatePage();
}




