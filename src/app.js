const pokemonQuantity = 898;

const cardsContainer = document.querySelector('.cards-container');

const previousButton = document.querySelector('#previous-page');
const nextButton = document.querySelector('#next-page');

const previousPokemonButton = document.querySelector('#previous-pokemon');
const nextPokemonButton = document.querySelector('#next-pokemon');

let pageInput = document.querySelector('#requiredPage');

let rows;
let columns;
let cardsPerPage; 

let page = 0;
let availablePages;

let overlayButton = document.querySelector('.overlay button');
let overlay = document.querySelector('.overlay');
let pokemonDetailsContainer = document.querySelector('.pokemon-details');

nextButton.onclick=movePageForward;
previousButton.onclick=movePageBackwards;

previousPokemonButton.onclick=getSiblingDetails;
nextPokemonButton.onclick=getSiblingDetails;

buttonsBlocked = true;

window.onresize = redistributeGrid;

pageInput.onchange=managePageInput;

document.addEventListener('DOMContentLoaded', ()=>{startApp()});



function movePageForward(){
    if(buttonsBlocked){
        return;
    }
    page++;
    updatePage();
}

function movePageBackwards(){
    if(buttonsBlocked){
        return;
    }
    page--;
    updatePage();
}


function updatePage(){
    buttonsBlocked = true;
    pageInput.disabled = true;
    if(page===0){
        previousButton.classList.add('not-visible');
    } else {
        if(previousButton.classList.contains('not-visible')){
            previousButton.classList.remove('not-visible');
        }
    }

    if (page===(availablePages-1)) {
        nextButton.classList.add('not-visible');
    } else {
        if(nextButton.classList.contains('not-visible')){
            nextButton.classList.remove('not-visible');
        }
    }
    

    let cards = document.querySelectorAll('.card');

    if(cards.length>0){
        cards.forEach(card=>{
            card.remove();
        })
    }

    pageInput.value=page+1;
    getApiInfo();

}

function getApiInfo(){
    fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${cardsPerPage*page}&limit=${cardsPerPage}`)
        .then(response => response.json())
        .then(response => createCards(response.results))
        .catch(error => console.log(error));
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

        card.appendChild(name);
        card.appendChild(number);
        card.appendChild(image);

        cardsContainer.appendChild(card);

        fetch(url)
            .then(response => response.json())
            .then(response => {
                image.src= `${response.sprites.front_default}`;
            })
            .catch(error => console.log(error));
    })

    buttonsBlocked = false;
    pageInput.disabled = false;
}

cardsContainer.onclick=(e)=>{
    if(!(e.target.tagName === 'SECTION')){
        let target = (e.target.tagName === 'ARTICLE') ? e.target : e.target.parentElement;
        getPokemonDetails(target);
    }
}

function getPokemonDetails(target){
    let id = target.id.replace('pokemon-', '');
    let url = `https://pokeapi.co/api/v2/pokemon/${id}/`
    fetch(url)
        .then(response => response.json())
        .then(response => showPokemonDetails(response))
        .catch(error => console.log(error))
}

function showPokemonDetails(response){
    
    removePreviousDetails();
    
    let id = response.id;
    let idString = id.toString();
    
    while(idString.length<3){
        idString = "0"+idString;
    }

    let nameEl = document.createElement('H2');
    nameEl.appendChild(document.createTextNode(response.name));

    let imageEl = document.createElement('IMG');
    imageEl.src=`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${idString}.png`;
    imageEl.alt=`${response.name} Image.`

    let abilitiesEl = createAbilities(response.abilities)   
    let physicalChar = createPhysicalChar(response.height, response.weight);
    let typesEl = createTypes(response.types);

    overlay.firstElementChild.id=`details-pokemon-${id}`;
    overlay.firstElementChild.appendChild(imageEl);
    overlay.firstElementChild.appendChild(nameEl);
    overlay.firstElementChild.appendChild(abilitiesEl);
    overlay.firstElementChild.appendChild(physicalChar);
    overlay.firstElementChild.appendChild(typesEl);

    checkSiblingButtonsVisibility(id);

    overlay.classList.remove('translated');
}

overlayButton.onclick=()=>{
    overlay.classList.add('translated');
}

function createPhysicalChar(height, weight){

    let physicalChar=document.createElement('DIV');
    let physicalCharHeading = document.createElement('H3');
    let physicalCharInfo = document.createElement('DIV');
    physicalCharInfo.classList.add('detail-info-div');
    physicalCharHeading.appendChild(document.createTextNode('Physical Characteristics'));
    physicalChar.appendChild(physicalCharHeading);

    let heightEl = document.createElement('P');
    let heightSpan = document.createElement('SPAN');
    heightSpan.appendChild(document.createTextNode(height));
    heightEl.appendChild(heightSpan);
    heightEl.appendChild(document.createTextNode(' dm'));

    let weightEl = document.createElement('P');
    let weightSpan = document.createElement('SPAN');
    weightSpan.appendChild(document.createTextNode(weight));
    weightEl.appendChild(weightSpan);
    weightEl.appendChild(document.createTextNode(' hg'));

    physicalCharInfo.appendChild(heightEl);
    physicalCharInfo.appendChild(weightEl);

    physicalChar.appendChild(physicalCharInfo);
    
    return physicalChar;
}

function createAbilities(abilitiesArray){
    let abilitiesEl = document.createElement('DIV');
    let abilitiesHeading = document.createElement('H3');
    abilitiesHeading.appendChild(document.createTextNode('Abilities'));
    abilitiesEl.appendChild(abilitiesHeading);
    let abilitiesElInfo = document.createElement('DIV');
    abilitiesElInfo.classList.add('detail-info-div');
    abilitiesArray.forEach(abilityArray => {
        let abilityEl = document.createElement('P');
        abilityEl.appendChild(document.createTextNode(abilityArray.ability.name));
        abilitiesElInfo.appendChild(abilityEl);
    })

    abilitiesEl.appendChild(abilitiesElInfo);

    return abilitiesEl;
}

function createTypes(typesResponseArray){
    let typesEl = document.createElement('DIV');
    typesEl.classList.add('detail-info-div');
    typesEl.classList.add('types-div');
    typesResponseArray.forEach(typeObject=>{
        let typeContainer = document.createElement('DIV');
        let typeEl = document.createElement('P');
        typeEl.appendChild(document.createTextNode(typeObject.type.name));
        let button = document.createElement('BUTTON');
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"/>
        </svg>`
        button.addEventListener('click', getTypeDetails);
        typeContainer.appendChild(typeEl);
        typeContainer.appendChild(button);
        typeContainer.classList.add(`type-${typeObject.type.name}`);

        typesEl.appendChild(typeContainer);
    })

    return typesEl;
}

function removePreviousDetails(){
    if(pokemonDetailsContainer.children.length>1){
        let childs = [...pokemonDetailsContainer.children];
        childs.forEach(child => {
            if(child.tagName!=="BUTTON"){
                child.remove();
            }
        })   
    }
}

function redistributeGrid(){
    let body = document.querySelector('body');
    let newColumns = getComputedStyle(cardsContainer).getPropertyValue("grid-template-columns").split(" ").length;
    if(newColumns<columns && body.classList.contains('vh-100')){
        body.classList.remove('vh-100');
    } else if(newColumns>=columns && !(body.classList.contains('vh-100'))){
        body.classList.add('vh-100');
    }
}

function startApp(){
    rows = getComputedStyle(cardsContainer).getPropertyValue("grid-template-rows").split(" ").length;
    columns = getComputedStyle(cardsContainer).getPropertyValue("grid-template-columns").split(" ").length;
    cardsPerPage = rows*columns; 

    availablePages = Math.ceil(pokemonQuantity/cardsPerPage);

    pageInput.max=availablePages;

    let pagerIndicator = document.querySelector('#totalPages');
    pagerIndicator.textContent = availablePages;

    updatePage();
}

function managePageInput(e){
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

function getSiblingDetails(e){
    let id = pokemonDetailsContainer.id.replace("details-pokemon-", "");

    if(e.target.classList.contains('next-pokemon') ){
        id++;
    } else{
        id--;
    }

    let url = `https://pokeapi.co/api/v2/pokemon/${id}/`
    fetch(url)
        .then(response => response.json())
        .then(response => showPokemonDetails(response))
        .catch(error => console.log(error))
}

function checkSiblingButtonsVisibility(id){
    if(id===1){
        previousPokemonButton.classList.add('not-visible');
    } else if(id===pokemonQuantity){
        nextPokemonButton.classList.add('not-visible');
    } else{
        let notVisible = document.querySelectorAll('.pokemon-button.not-visible');
        if(notVisible.length>0){
            notVisible.forEach( button =>{
                button.classList.remove('not-visible');
            })
        }
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

function getTypeDetails(){
    console.log('click');
}