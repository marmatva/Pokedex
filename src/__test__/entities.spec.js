import { Pokemon, PokemonList, TypeRelationsDetails } from "../entities.js";
import firstPokemonApiResponse from '../../cypress/fixtures/pokemon-1.json';
import firstPokemonObject from './firstPokemon.json';
import firstPokemonListApiResponse from '../../cypress/fixtures/firstPokemonsList.json';
import firstPokemonListObject from './firstList.json';
import typeApiResponse from '../../cypress/fixtures/type-12.json';
import typeObject from './type-12.json';

test('Test Pokemon entity', ()=>{
    let firstPokemonInstance = new Pokemon(firstPokemonApiResponse);
    expect(firstPokemonInstance).toEqual(firstPokemonObject);
})

test('Test PokemonList entity', ()=>{
    let firstPokemonListInstance = new PokemonList(firstPokemonListApiResponse.results);
    expect(firstPokemonListInstance).toEqual(firstPokemonListObject);
})

test('Test Types entity', ()=>{
    let firtsTypeInstance = new TypeRelationsDetails(typeApiResponse);
    expect(firtsTypeInstance).toEqual(typeObject);
})

