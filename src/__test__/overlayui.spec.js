/// <reference types="Jest"/>

jest.mock('../pokedex.js', ()=> ({
    getTypeDetails: jest.fn(),
    verifyCurrentPage: jest.fn(),
})
);
import fixture from './pokedex.fixture.js'

document.body.innerHTML = fixture;

import { showPokemonDetails, getOverlay, showTypeDetails, closeOverlay } from '../overlayui.js'
import firstPokemonResponse from './firstPokemon.json'
import penultimatePokemonResponse from './penultimatePokemon.json'
import lastPokemonResponse from './lastPokemon.json'
import typeResponse from './type-12.json'
import * as mockPokedex from '../pokedex.js';

test('test the display of pokemon details (showPokemonDetails)', ()=>{

    
    showPokemonDetails(firstPokemonResponse);
    
    let container = getOverlay().firstElementChild;
    expect(container.id).toEqual('details-pokemon-1');
    expect(container.querySelector('h2').textContent).toEqual('bulbasaur');
    expect(container.querySelector('img').alt).toEqual('bulbasaur Image.');
    expect(container.querySelector('img').src).toEqual('https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png');
    
    let detailsDivs = container.querySelectorAll('.pokemon-details-div');
    expect(detailsDivs).toHaveLength(3);

    expect(detailsDivs[0].querySelector('h3').textContent).toEqual('Abilities');
    expect(detailsDivs[0].querySelector('div').className).toEqual('detail-info-div');
    
    let abilities = detailsDivs[0].querySelectorAll('div p');
    expect(abilities).toHaveLength(2);
    expect(abilities[0].textContent).toEqual('overgrow');
    expect(abilities[1].textContent).toEqual('chlorophyll');
    
    expect(detailsDivs[1].querySelector('h3').textContent).toEqual('Physical Characteristics');
    expect(detailsDivs[1].querySelector('div').className).toEqual('detail-info-div');
    
    let physicalChar = detailsDivs[1].querySelectorAll('div p');
    let physicalCharSpan = detailsDivs[1].querySelectorAll('div p span');
    expect(physicalChar).toHaveLength(2);
    expect(physicalCharSpan).toHaveLength(2);
    expect(physicalChar[0].textContent).toMatch(/\d+ dm/);
    expect(physicalChar[1].textContent).toMatch(/\d+ hg/);

    expect(detailsDivs[2].className).toContain('types-div');
    expect(detailsDivs[2].className).toContain('detail-info-div');

    let typesContainers = detailsDivs[2].querySelectorAll('div');

    expect(typesContainers).toHaveLength(2);

    let types = ['grass', 'poison'];
    let typesId= ["12", "4"];

    typesContainers.forEach( (container, i) => {
        expect(container.className).toContain(`type-${types[i]}`);
        expect(container.querySelector('p').textContent).toEqual(types[i]);
        expect(container.querySelector('button').id).toEqual(`type/${typesId[i]}/`);
        expect(container.querySelector('button').innerHTML).toMatch(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"></path>
        </svg>`);
        
    
        container.querySelector('button').click();

        expect(mockPokedex.getTypeDetails).toHaveBeenCalledTimes(i+1);
    })

    expect(document.querySelector('#previous-pokemon').className).toContain('not-visible');
    expect(document.querySelector('#next-pokemon').className).not.toContain('not-visible');
})

test('Test the removal of previous details', ()=>{

    let container = getOverlay().firstElementChild;

    let detailsDivs = container.querySelectorAll('.pokemon-details-div');
    expect(detailsDivs).toHaveLength(3);

    showPokemonDetails(firstPokemonResponse);

    detailsDivs = container.querySelectorAll('.pokemon-details-div');
    expect(detailsDivs).not.toHaveLength(6);
    expect(detailsDivs).toHaveLength(3);
})

test('Test correct types details display', ()=>{
    document.body.innerHTML = fixture;

    showTypeDetails(typeResponse);
    
    let typeDetails = getOverlay().querySelector('.type-details');
    expect(typeDetails.querySelector('h2').textContent).toEqual('grass');

    let headings3 = typeDetails.querySelectorAll('h3');
    expect(headings3).toHaveLength(2);
    expect(headings3[0].textContent).toEqual('Strengths');
    expect(headings3[1].textContent).toEqual('Weaknesses');

    let relationTypesContainer = typeDetails.querySelectorAll('.relations-type-container');
    expect(relationTypesContainer).toHaveLength(2);

    let typesRelations={
        0: {
            0:["ground", "rock", "water"],
            1: ["ground", "water", "grass", "electric"],
        },
        1: {
            0: ["flying", "poison", "bug", "steel", "fire", "grass", "dragon"],
            1: ["flying", "poison", "bug", "fire", "ice"],
        }
    }

    relationTypesContainer.forEach( (container, i) => {
        let headings4 = container.querySelectorAll('h4');
        expect(headings4[0].textContent).toEqual('Attack');
        expect(headings4[1].textContent).toEqual('Defense');

        let damageRelationContainer = container.querySelectorAll('div.related-types-container');
        expect(damageRelationContainer).toHaveLength(2);
        damageRelationContainer.forEach( (secondaryContainer,j) =>{
            let paragraphs = secondaryContainer.querySelectorAll('p');
            expect(paragraphs).toHaveLength(typesRelations[i][j].length);
            paragraphs.forEach((p, k) =>{
                expect(p.textContent).toEqual(typesRelations[i][j][k]);
                expect(p.className).toEqual(`type-${typesRelations[i][j][k]}`);
            })
        })
    })
})

test('Correct type details pull out', ()=>{
    let typeDetails = getOverlay().querySelector('.type-details');
    let closeButton = typeDetails.querySelector('button.close-button');

    closeButton.click();

    expect(typeDetails).toBeNull;
    
})

test('sibling buttons vissibility', ()=>{
    let previousPokemon = document.querySelector('#previous-pokemon');
    let nextPokemon = document.querySelector('#next-pokemon');

    showPokemonDetails(lastPokemonResponse);
    expect(previousPokemon.className).not.toContain('not-visible');
    expect(nextPokemon.className).toContain('not-visible');

    showPokemonDetails(penultimatePokemonResponse);
    expect(previousPokemon.className).not.toContain('not-visible');
    expect(nextPokemon.className).not.toContain('not-visible');

});

test('test overlay closing', ()=>{
    closeOverlay();
    expect(getOverlay().className).toContain('translated');
    expect(mockPokedex.verifyCurrentPage).toHaveBeenCalledTimes(1);
})