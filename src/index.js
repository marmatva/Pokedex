
import {closeOverlay} from './overlayui.js'
import {getCardsPerPage, updateAvailablePages, redistributeGrid, getCardsContainer , getPageInput} from './mainui.js'
import {updatePage, movePage, managePageInput, getSiblingDetails, getPokemonDetails} from './pokedex.js'
import{PokemonList} from './entities.js'

function asignEventHandlers(){
    window.onresize = redistributeGrid;

    document.querySelector('#next-page').onclick=()=>{movePage(1)};
    document.querySelector('#previous-page').onclick=()=>{movePage(-1)};

    getPageInput().onchange=managePageInput;
    
    getCardsContainer().onclick=getPokemonDetails;

    document.querySelector('#previous-pokemon').onclick=getSiblingDetails;
    document.querySelector('#next-pokemon').onclick=getSiblingDetails;

    document.querySelector('.overlay button').onclick=closeOverlay;
}


function startApp(){
    asignEventHandlers();
    getCardsPerPage();
    updateAvailablePages();
    updatePage();
}

document.addEventListener('DOMContentLoaded', ()=>{startApp()});


