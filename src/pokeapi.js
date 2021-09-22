export function getApiInfo(offset, limit){
    let url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`
    return fetch(url)
        .then(response => response.json())
        .then(response => response.results)
        .catch(error => console.log(error));
}

export function getPokemonDetails(id){
    let url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    return fetch(url)
        .then(response => response.json())
        .catch(error => console.log(error))
}

export function getImageSrc(url){
    return fetch(url)
            .then(response => response.json())
            .then(response => response.sprites.front_default)
            .catch(error => console.log(error));
}

export function fetchTypeDetails(id){
    return fetch(`https://pokeapi.co/api/v2/${id}`)
        .then(response => response.json())
        .catch(error => console.log(error));
    
}