let cardsContainer = document.querySelector('.cards-container');

let previousButton = document.querySelector('#previous-page');
let nextButton = document.querySelector('#next-page');

let pager = document.querySelector('.pager');

let rows = getComputedStyle(cardsContainer).getPropertyValue("grid-template-rows").split(" ").length;
let columns = getComputedStyle(cardsContainer).getPropertyValue("grid-template-columns").split(" ").length;

let cardsPerPage = rows*columns; 

let page = 0;

let overlayButton = document.querySelector('.overlay button');
let overlay = document.querySelector('.overlay');
let pokemonDetailsContainer = document.querySelector('.pokemon-details');

//https://pokeapi.co/api/v2/pokemon/?offset=0&limit=16 Hay hasta el 898

document.addEventListener('DOMContentLoaded', ()=>{updatePage()});

nextButton.onclick=movePageForward;

function movePageForward(){
    page++;
    updatePage();
}

function movePageBackwards(){
    page--;
    updatePage();
}

function blockPagerButtons(){
    previousButton.onclick=()=>{};
    nextButton.onclick=()=>{};
}

function unblockPagerButtons(){
    if(page===0){
        nextButton.onclick=movePageForward;
    } else{
        nextButton.onclick=movePageForward;
        previousButton.onclick=movePageBackwards;
    }
}


function updatePage(){
    blockPagerButtons();
    if(page===0){
        previousButton.classList.add('not-visible');
    } else if(page===1){
        if(previousButton.classList.contains('not-visible')){
            previousButton.classList.remove('not-visible');
        }
    }

    let cards = document.querySelectorAll('.card');

    if(cards.length>0){
        cards.forEach(card=>{
            card.remove();
        })
    }

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
       
        let card = document.createElement('ARTICLE');
        card.classList.add('card');
        let id = `pokemon-${pokemonId}`;
        card.id= id;
        
        let name = document.createElement('H2');
        name.appendChild(document.createTextNode(pokemon.name));
        
        let number = document.createElement('P');
        number.appendChild(document.createTextNode(`Nº ${pokemonId}`));
        
        let image = document.createElement('IMG');

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

    unblockPagerButtons();
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

    let abilitiesEl = createAbilities(response.abilities)   
    let physicalChar = createPhysicalChar(response.height, response.weight);
    let typesEl = createTypes(response.types);

   
    overlay.firstElementChild.appendChild(imageEl);
    overlay.firstElementChild.appendChild(nameEl);
    overlay.firstElementChild.appendChild(abilitiesEl);
    overlay.firstElementChild.appendChild(physicalChar);
    overlay.firstElementChild.appendChild(typesEl);

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
        let typeEl = document.createElement('P');
        typeEl.appendChild(document.createTextNode(typeObject.type.name));
        typeEl.classList.add(`type-${typeObject.type.name}`)
        typesEl.appendChild(typeEl);
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