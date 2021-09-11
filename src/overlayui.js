import {requestPokemonDetails, requestTypeDetails} from './storage.js'

import {pokemonQuantity} from './mainui.js'

export const overlay = document.querySelector('.overlay');
const pokemonDetailsContainer = document.querySelector('.pokemon-details');

export const previousPokemonButton = document.querySelector('#previous-pokemon'); 
export const nextPokemonButton = document.querySelector('#next-pokemon'); 

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

export function showPokemonDetails(response){
    
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

function createAbilities(abilitiesArray){
    let abilitiesEl = document.createElement('DIV');
    abilitiesEl.classList.add('pokemon-details-div');
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

function createPhysicalChar(height, weight){

    let physicalChar=document.createElement('DIV');
    physicalChar.classList.add('pokemon-details-div');
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

function createTypes(typesResponseArray){
    let typesEl = document.createElement('DIV');
    typesEl.classList.add('detail-info-div'); 
    typesEl.classList.add('types-div');
    typesEl.classList.add('pokemon-details-div');

    typesResponseArray.forEach(typeObject=>{
        let typeContainer = document.createElement('DIV');
        let typeEl = document.createElement('P');
        typeEl.appendChild(document.createTextNode(typeObject.type.name));
        let id = typeObject.type.url.replace("https://pokeapi.co/api/v2/","");
        let button = document.createElement('BUTTON');
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"/>
        </svg>`
        button.id = id;
        button.addEventListener('click', getTypeDetails);
        typeContainer.appendChild(typeEl);
        typeContainer.appendChild(button);
        typeContainer.classList.add(`type-${typeObject.type.name}`);

        typesEl.appendChild(typeContainer);
    })

    return typesEl;
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

export async function getSiblingDetails(e){
    let id = pokemonDetailsContainer.id.replace("details-pokemon-", "");

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

async function getTypeDetails(e){
    let target = e.target;

    while(target.tagName !== 'BUTTON'){
        target = target.parentElement;
    }

    let id = target.id;
    let response = await requestTypeDetails(id);
    showTypeDetails(response);
}

function showTypeDetails(response){
    let damageRelations = response.damage_relations;

    let typeDetailsContainer = document.createElement('DIV');
    typeDetailsContainer.classList.add('type-details');

    let closeButton = document.createElement('BUTTON');
    closeButton.appendChild(document.createTextNode('X'));
    closeButton.addEventListener('click', pullOutTypeDetails);
    closeButton.classList.add('close-button');

    let typeMainHeading = document.createElement('H2');
    typeMainHeading.appendChild(document.createTextNode(response.name));

    let strengthHeading = document.createElement('H3'); 
    strengthHeading.appendChild(document.createTextNode('Strengths')); 

    let strengthAttackArray = [...damageRelations.double_damage_to];
    let strengthDefenseArray = [...damageRelations.no_damage_from, ...damageRelations.half_damage_from];

    let strengthContainer = createStrengthDetailsContainer(strengthAttackArray, strengthDefenseArray);

    let weakHeading = document.createElement('H3');
    weakHeading.appendChild(document.createTextNode('Weaknesses'));

    let weakAttackArray = [...damageRelations.half_damage_to, ...damageRelations.no_damage_to ];
    let weakDefenseArray = [...damageRelations.double_damage_from];

    let weakContainer = createStrengthDetailsContainer(weakAttackArray, weakDefenseArray);    

    typeDetailsContainer.appendChild(closeButton);
    typeDetailsContainer.appendChild(typeMainHeading);
    typeDetailsContainer.appendChild(strengthHeading);
    typeDetailsContainer.appendChild(strengthContainer);
    typeDetailsContainer.appendChild(weakHeading);
    typeDetailsContainer.appendChild(weakContainer);

    pokemonDetailsContainer.appendChild(typeDetailsContainer);

}

function createDamageRelationContainer(relationsArray){
    let container = document.createElement('DIV');
    container.classList.add('related-types-container')

    relationsArray.forEach( typeObject =>{
        let typeEl = document.createElement('P');
        typeEl.appendChild(document.createTextNode(typeObject.name));
        typeEl.classList.add(`type-${typeObject.name}`);

        container.appendChild(typeEl);
    })

    return container;
}

function createStrengthDetailsContainer(firstArray, secondArray){
    let attackHeading = document.createElement('H4');
    attackHeading.appendChild(document.createTextNode('Attack'));
    let defenseHeading = document.createElement('H4');
    defenseHeading.appendChild(document.createTextNode('Defense'));

    let strengthHeading = document.createElement('H3');
    strengthHeading.appendChild(document.createTextNode('Strengths'));
    let strengthContainer = document.createElement('DIV');
    strengthContainer.classList.add('relations-type-container');

    let attackContainer = createDamageRelationContainer(firstArray);
    let defenseContainer = createDamageRelationContainer(secondArray);
    
    strengthContainer.appendChild(attackHeading);
    strengthContainer.appendChild(defenseHeading);
    strengthContainer.appendChild(attackContainer);
    strengthContainer.appendChild(defenseContainer);

    return strengthContainer;
}

function pullOutTypeDetails(){
    let typeDetails = document.querySelector('.type-details');
    typeDetails.classList.add('pull-out');

    setTimeout(()=>{
        typeDetails.remove();
    }, 500);
}