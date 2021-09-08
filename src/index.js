import {getPokemonDetails, fetchTypeDetails} from './pokeapi.js'
import {getSiblingDetails, overlay ,previousPokemonButton, nextPokemonButton, showPokemonDetails,} from './overlayui.js'
import {getCardsPerPage, updateAvailablePages, updatePage, movePageForward, movePageBackwards, managePageInput , verifyCurrentPage, redistributeGrid, cardsContainer ,previousButton, nextButton, pageInput} from './mainui.js'


window.onresize = redistributeGrid;

nextButton.onclick=movePageForward;
previousButton.onclick=movePageBackwards;

cardsContainer.onclick= async (e)=>{
    if(!(e.target.tagName === 'SECTION')){
        let target = (e.target.tagName === 'ARTICLE') ? e.target : e.target.parentElement;
        let id = target.id.replace('pokemon-', '');
        let url = `https://pokeapi.co/api/v2/pokemon/${id}/`
        let response = await getPokemonDetails(url);
        showPokemonDetails(response);
    }
}

pageInput.onchange=managePageInput;

previousPokemonButton.onclick=getSiblingDetails;
nextPokemonButton.onclick=getSiblingDetails;

document.querySelector('.overlay button').onclick=()=>{
    overlay.classList.add('translated');   
    verifyCurrentPage();
}

document.addEventListener('DOMContentLoaded', ()=>{startApp()});


function startApp(){
    getCardsPerPage();
    updateAvailablePages();
    updatePage();
}




