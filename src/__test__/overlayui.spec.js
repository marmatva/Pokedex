/// <reference types="Jest"/>
import fixture from './pokedex.fixture.js'

document.body.innerHTML = fixture;

import { showPokemonDetails, overlay } from '../overlayui.js'
import pokemonsResponse from '../../cypress/fixtures/pokemon-1.json'

test('test the display of pokemon details', ()=>{
    showPokemonDetails(pokemonsResponse);
    expect(overlay.firstElementChild.id).toEqual('details-pokemon-1')
})
