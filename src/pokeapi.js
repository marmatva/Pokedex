export function getApiInfo(url){
    return fetch(url)
        .then(response => response.json())
        .then(response => response.results)
        .catch(error => console.log(error));
}

export function getPokemonDetails(url){
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