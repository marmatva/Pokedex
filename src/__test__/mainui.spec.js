jest.mock('../pokedex.js', ()=> ({
    
    blockPageChange: jest.fn(),
})
);
jest.mock('../storage.js', ()=> ({
    requestImageSource: jest.fn(),
})
);

import * as main from '../mainui.js'
import * as mockPokedex from '../pokedex.js'
import * as mockStorage from '../storage.js'
import fixture from './pokedex.fixture.js'
import pokemonsResponse from '../../cypress/fixtures/firstPokemonsList.json'
import lastPokemonsResponse from '../../cypress/fixtures/lastPokemonsList.json'
document.body.innerHTML=fixture;



test('Getting elements functions', ()=>{
    expect(main.getPageInfo()).toMatchObject({availablePages: undefined, cardsPerPage: undefined, page: 0})
    expect(main.getCardsContainer()).toEqual(document.querySelector('.cards-container'));
    expect(main.getPageInput()).toEqual(document.querySelector('#requiredPage'));
})

test('test the text update of total available pages', ()=>{
    main.updateAvailablePages();
    expect(main.getPageInput().max).toEqual("undefined");
})

test('Test preparing page for an update', ()=>{ //REVISAR
    main.preparePageForUpdate();
    //expect(getPageInput().disabled).toEqual(true);
    expect(mockPokedex.blockPageChange).toHaveBeenCalledTimes(1);
    expect(document.querySelectorAll('.card')).toHaveLength(0);
    
})

test('updating page number and page input value', ()=>{
    let {page: firstPageNumber} = main.getPageInfo();
    
    main.updatePageNumber(3);
    let{page: firstModifiedPageNumber} = main.getPageInfo();
    expect(firstModifiedPageNumber).toEqual(firstPageNumber+3);
    
    main.updatePageNumber(0,5);
    let{page: secondModifiedPageNumber} = main.getPageInfo();
    expect(secondModifiedPageNumber).toEqual(5);

    main.updatePageInputValue();
    expect(parseInt(main.getPageInput().value)).toEqual(6);

    main.updatePageInputValue(10);
    expect(parseInt(main.getPageInput().value)).toEqual(10);
})

test('Show Warning function', ()=>{
    main.showWarning('Testing');
    expect(document.querySelector('div.warning-container').textContent).toEqual('Testing');

    setTimeout(()=>{
        expect(document.querySelector('div.warning-container')).toBeNull;
    },2000)
})

test('Test the creation of cards', ()=>{
    main.createCards(pokemonsResponse.results);
    expect(mockStorage.requestImageSource).toHaveBeenCalledTimes(12);
    let names = ["bulbasaur", "ivysaur", "venusaur", "charmander", "charmeleon", "charizard", "squirtle", "wartortle", "blastoise", "caterpie", "metapod", "butterfree"]
    let cards = document.querySelectorAll('.card');
    expect(cards).toHaveLength(12);
    cards.forEach((card, i)=>{
        expect(card.querySelector('h2').textContent).toEqual(names[i]);
        expect(card.querySelector('p').textContent).toEqual(`Nº ${i+1}`);
        expect(card.querySelector('img').alt).toEqual(`${names[i]} Image.`);
        expect(card.querySelector('img').className).toEqual('loading');
        expect(card.querySelector('div').className).toEqual('loading-div');
    })
})

test('Last page of pokemons', ()=>{
    main.preparePageForUpdate();
    main.createCards(lastPokemonsResponse.results);
    let cards = document.querySelectorAll('.card');
    expect(cards).toHaveLength(10);
})

test('Test getting Cards and buttons visibility', ()=>{
    main.updatePageNumber(0, 0);
    main.getCardsPerPage();
    let {availablePages, cardsPerPage, page} = main.getPageInfo();
    expect(availablePages).toEqual(898);
    expect(cardsPerPage).toEqual(1);
    expect(page).toEqual(0);

    main.preparePageForUpdate();
    expect(document.querySelector('#previous-page').className).toContain('not-visible');
    expect(document.querySelector('#next-page').className).not.toContain('not-visible');

    main.updatePageNumber(5);
    main.preparePageForUpdate();
    expect(document.querySelector('#previous-page').className).not.toContain('not-visible');
    expect(document.querySelector('#next-page').className).not.toContain('not-visible');
    
    main.updatePageNumber(0,897);
    main.preparePageForUpdate();
    expect(document.querySelector('#previous-page').className).not.toContain('not-visible');
    expect(document.querySelector('#next-page').className).toContain('not-visible');
    
    main.updatePageNumber(-1);
    main.preparePageForUpdate();
    expect(document.querySelector('#previous-page').className).not.toContain('not-visible');
    expect(document.querySelector('#next-page').className).not.toContain('not-visible');
})
