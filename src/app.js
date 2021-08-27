let cardsContainer = document.querySelector('.cards-container');

let previousButton = document.querySelector('#previous-page');
let nextButton = document.querySelector('#next-page');

let pager = document.querySelector('.pager');

let rows = getComputedStyle(cardsContainer).getPropertyValue("grid-template-rows").split(" ").length;
let columns = getComputedStyle(cardsContainer).getPropertyValue("grid-template-columns").split(" ").length;

let cardsPerPage = rows*columns; 

let page = 0;

//https://pokeapi.co/api/v2/pokemon/?offset=0&limit=16 Hay hasta el 898

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

}

getApiInfo();
