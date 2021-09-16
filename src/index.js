import {requestPokemonDetails} from './storage.js'
import {getSiblingDetails, getOverlay, showPokemonDetails, getTypeDetails} from './overlayui.js'
import {getCardsPerPage, updateAvailablePages, updatePage, movePageForward, movePageBackwards, managePageInput , verifyCurrentPage, redistributeGrid, getCardsContainer , pageInput} from './mainui.js'


window.onresize = redistributeGrid;

document.querySelector('#next-page').onclick=movePageForward;
document.querySelector('#previous-page').onclick=movePageBackwards;

getCardsContainer().onclick= async (e)=>{
    if(!(e.target.tagName === 'SECTION')){
        let target = (e.target.tagName === 'ARTICLE') ? e.target : e.target.parentElement;
        let id = target.id.replace('pokemon-', '');
        let response = await requestPokemonDetails(id);
        showPokemonDetails(response, getTypeDetails);
    }
}

pageInput.onchange=managePageInput;

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




