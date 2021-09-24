jest.mock('../storage.js', ()=>({
    saveInLocalStorage: jest.fn(), 
    getFromLocalStorage: jest.fn()
}))

jest.mock('../pokeapi.js', ()=>({
    fetchTypeDetails: jest.fn(()=>"api test"),
    getApiInfo: jest.fn(()=>"api test"),
    getPokemonDetails: jest.fn(()=>"api test")
}))

jest.mock('../entities.js')

import * as mockStorage from "../storage.js"
import * as mockPokeapi from "../pokeapi.js";
import * as service from '../service.js'
import { Pokemon, PokemonList, TypeRelationsDetails } from "../entities.js";

describe('Testing the service module', ()=>{
    beforeEach(jest.clearAllMocks);
    test('request pokemon details', async ()=>{
        mockStorage.getFromLocalStorage
            .mockImplementationOnce(()=>null)
            .mockImplementationOnce((x)=> `{"result": "${x}"}`);
        
        Pokemon.mockImplementation(()=>({result: "test"}))
        
        let firstCase = await service.requestPokemonDetails(1);
        expect(mockStorage.getFromLocalStorage).toHaveBeenCalledTimes(1);
        expect(mockStorage.getFromLocalStorage).toHaveBeenLastCalledWith(`pokemon-1`);
        expect(mockStorage.getFromLocalStorage).toHaveReturnedWith(null)
        expect(mockPokeapi.getPokemonDetails).toHaveBeenCalledTimes(1);
        expect(mockPokeapi.getPokemonDetails).toHaveBeenLastCalledWith(1);
        expect(Pokemon).toHaveBeenCalledTimes(1);
        expect(Pokemon).toHaveBeenLastCalledWith("api test");
        expect(mockStorage.saveInLocalStorage).toHaveBeenCalledTimes(1);
        expect(mockStorage.saveInLocalStorage).toHaveBeenLastCalledWith(`pokemon-1`, {result: "test"});
        expect(firstCase).toEqual({result: "test"});
        
        let secondCase = await service.requestPokemonDetails(2);
        expect(mockStorage.getFromLocalStorage).toHaveBeenCalledTimes(2);
        expect(mockStorage.getFromLocalStorage).toHaveBeenLastCalledWith(`pokemon-2`);
        expect(mockStorage.getFromLocalStorage).toHaveReturnedWith(`{"result": "pokemon-2"}`);
        expect(mockPokeapi.getPokemonDetails).toHaveBeenCalledTimes(1);
        expect(mockStorage.saveInLocalStorage).toHaveBeenCalledTimes(1);
        expect(secondCase).toEqual({"result": "pokemon-2"});
    })

    test('request pokemons list', async ()=>{
        mockStorage.getFromLocalStorage
            .mockImplementationOnce(()=> null)
            .mockImplementationOnce((x)=> `{"result": "${x}"}`);
        

        PokemonList.mockImplementation(()=>({result: "test"}))

        let firstCase = await service.requestPokemonsList(1, 2)
        expect(mockStorage.getFromLocalStorage).toHaveBeenCalledTimes(1);
        expect(mockStorage.getFromLocalStorage).toHaveBeenLastCalledWith(`pokemons-list-offset-1-limit-2`);
        expect(mockPokeapi.getApiInfo).toHaveBeenCalledTimes(1);
        expect(PokemonList).toHaveBeenCalledTimes(1);
        expect(PokemonList).toHaveBeenLastCalledWith("api test");
        expect(mockStorage.saveInLocalStorage).toHaveBeenCalledTimes(1);
        expect(mockStorage.saveInLocalStorage).toHaveBeenLastCalledWith(`pokemons-list-offset-1-limit-2`,{result: "test"});
        expect(firstCase).toEqual({result: "test"});
        
        let secondCase = await service.requestPokemonsList(3, 4);
        expect(mockStorage.getFromLocalStorage).toHaveBeenCalledTimes(2);
        expect(mockStorage.getFromLocalStorage).toHaveBeenLastCalledWith(`pokemons-list-offset-3-limit-4`);
        expect(mockPokeapi.getApiInfo).toHaveBeenCalledTimes(1);
        expect(mockStorage.saveInLocalStorage).toHaveBeenCalledTimes(1);
        expect(secondCase).toEqual({"result": "pokemons-list-offset-3-limit-4"})
    })

    test('request type details', async ()=>{
        mockStorage.getFromLocalStorage
            .mockImplementationOnce(()=>null)
            .mockImplementationOnce((x)=> `{"result": "${x}"}`);
    
        
        TypeRelationsDetails.mockImplementation(()=>({result: "test"}));

        let firstCase = await service.requestTypeDetails('type-12');
        expect(mockStorage.getFromLocalStorage).toHaveBeenCalledTimes(1);
        expect(mockStorage.getFromLocalStorage).toHaveBeenLastCalledWith('type-type-12');
        expect(mockPokeapi.fetchTypeDetails).toHaveBeenCalledTimes(1);
        expect(mockPokeapi.fetchTypeDetails).toHaveBeenLastCalledWith('type-12');
        expect(TypeRelationsDetails).toHaveBeenCalledTimes(1);
        expect(TypeRelationsDetails).toHaveBeenLastCalledWith("api test");
        expect(mockStorage.saveInLocalStorage).toHaveBeenCalledTimes(1);
        expect(mockStorage.saveInLocalStorage).toHaveBeenLastCalledWith('type-type-12',{result: "test"});
        expect(firstCase).toEqual({result: "test"});

        let secondCase = await service.requestTypeDetails('type-21');
        expect(mockStorage.getFromLocalStorage).toHaveBeenCalledTimes(2);
        expect(mockStorage.getFromLocalStorage).toHaveBeenLastCalledWith('type-type-21');
        expect(mockPokeapi.fetchTypeDetails).toHaveBeenCalledTimes(1);
        expect(mockStorage.saveInLocalStorage).toHaveBeenCalledTimes(1);
        expect(secondCase).toEqual({"result": "type-type-21"})

    })

    test('Request Image Sources', async ()=>{
        mockStorage.getFromLocalStorage
            .mockImplementationOnce(()=>null)
            .mockImplementationOnce((x)=> `{"result": "${x}"}`);
    
        
        mockPokeapi.getPokemonDetails.mockImplementation(()=>{ return new Promise((resolve)=>resolve({sprites:{front_default: "test"}}))});

        let firstCase = await service.requestImageSource(1);
        expect(mockStorage.getFromLocalStorage).toHaveBeenCalledTimes(1);
        expect(mockStorage.getFromLocalStorage).toHaveBeenLastCalledWith("pokemon-1-image");
        expect(mockPokeapi.getPokemonDetails).toHaveBeenCalledTimes(1);
        expect(mockPokeapi.getPokemonDetails).toHaveBeenLastCalledWith(1);
        expect(mockStorage.saveInLocalStorage).toHaveBeenCalledTimes(1);
        expect(mockStorage.saveInLocalStorage).toHaveBeenLastCalledWith("pokemon-1-image","test")
        expect(firstCase).toEqual("test");

        let secondCase = await service.requestImageSource(2);
        expect(mockStorage.getFromLocalStorage).toHaveBeenCalledTimes(2);
        expect(mockStorage.getFromLocalStorage).toHaveBeenLastCalledWith("pokemon-2-image");
        expect(mockPokeapi.getPokemonDetails).toHaveBeenCalledTimes(1);
        expect(mockStorage.saveInLocalStorage).toHaveBeenCalledTimes(1);
        expect(secondCase).toEqual({"result": "pokemon-2-image"});
    })
})