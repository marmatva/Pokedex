import{ saveInLocalStorage, getFromLocalStorage} from "./storage.js"
import { fetchTypeDetails, getApiInfo, getPokemonDetails } from "./pokeapi.js";
import { Pokemon, PokemonList, TypeRelationsDetails } from "./entities.js";

function createPokemonsListKey(offset, limit){
    return `pokemons-list-offset-${offset}-limit-${limit}`;
};

function createPokemonDetailsKey(id){
    return `pokemon-${id}`;
};

function createPokemonTypeKey(id){
    return `type-${id}`;
};

function createImageKey(id){
    return `pokemon-${id}-image`;
}


export async function requestPokemonDetails(id){
    let key = createPokemonDetailsKey(id);
    try{
        let string = getFromLocalStorage(key);
        if(string === null){
            throw new Error(`Pokemon ${id} doesn't exist on localStorage yet`);
        }
        return JSON.parse(string);
    }catch(e){
        let response = await getPokemonDetails(id);
        let pokemon = new Pokemon(response);
        saveInLocalStorage(key, pokemon);
        return pokemon; 
    }
}

export async function requestPokemonsList(offset, limit){
    let key = createPokemonsListKey(offset, limit);
    try{
        let string = getFromLocalStorage(key);
        if(string === null){
            throw new Error(`The page offset ${offset} hasn't been save yet`);
        } 
        return JSON.parse(string)
    }catch(e){
        let response = await getApiInfo(offset, limit);
        let pokemonList = new PokemonList(response);
        saveInLocalStorage(key, pokemonList);
        return pokemonList;
    }
}

export async function requestTypeDetails(id){
    let key = createPokemonTypeKey(id);
    try{
        let string = getFromLocalStorage(key);
        if(string===null){
            throw new Error(`The type ${id} hasn't been saver yet`);
        }
        return JSON.parse(string);
    }catch(e){
        let response = await fetchTypeDetails(id);
        let typeRelations = new TypeRelationsDetails(response);
        saveInLocalStorage(key, typeRelations);
        return typeRelations;
    }
}

export async function requestImageSource(id){
    let key = createImageKey(id);
    try{
        let string = getFromLocalStorage(key);
        if(string === null){
            throw new Error(`The pokemon ${id}'s images hasn't been saved yet`);
        }
        return JSON.parse(string);
    }catch(e){
        let url = await getPokemonDetails(id)
        .then(response => response.sprites.front_default);
        saveInLocalStorage(key, url);
        return url;
    }
}

