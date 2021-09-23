import * as pokedex from '../pokedex.js'
import * as mockService from '../service.js'
import * as mockMainUi from '../mainui.js'
import * as mockOverlayUi from '../overlayui.js'
import fixture from './pokedex.fixture.js'

document.body.innerHTML = fixture; 
describe('Test', ()=>{
   afterEach(jest.clearAllMocks);
    test('Test blockPageChange, movePage and updatePage', async ()=>{
        let x = 1;
        let y = 5
        pokedex.blockPageChange(false);
        expect(document.querySelector('#requiredPage').disabled).toBeFalsy();
        
        let updatePageNumberSpy = jest.spyOn(mockMainUi, "updatePageNumber");
        updatePageNumberSpy.mockImplementation((n)=> n);
        
        let preparePageForUpdateSpy = jest.spyOn(mockMainUi, "preparePageForUpdate");
        
        let getPageInfoSpy = jest.spyOn(mockMainUi, "getPageInfo");
        getPageInfoSpy.mockImplementation(()=> ({cardsPerPage: x, page: y}));
        
        let requestPokemonsListSpy = jest.spyOn(mockService, "requestPokemonsList");
        requestPokemonsListSpy.mockImplementation(()=> "test");
        
        let createCardsSpy = jest.spyOn(mockMainUi, "createCards");
        createCardsSpy.mockImplementation(()=> {});
        
        await pokedex.movePage(x); //Hay otra forma de esperar y hacer el assertion de createCardsSpy??
    
        expect(updatePageNumberSpy).toHaveBeenCalledTimes(1)
        expect(updatePageNumberSpy).toHaveBeenLastCalledWith(x);
        
        expect(preparePageForUpdateSpy).toHaveBeenCalledTimes(1);
        
        expect(getPageInfoSpy).toHaveBeenCalledTimes(1);
        
        expect(requestPokemonsListSpy).toHaveBeenCalledTimes(1);
        expect(requestPokemonsListSpy).toHaveBeenLastCalledWith(x*y, x);
        
        expect(createCardsSpy).toHaveBeenCalledTimes(1);
        expect(createCardsSpy).toHaveBeenLastCalledWith("test");
    
        pokedex.blockPageChange();
        pokedex.movePage(y);
    
        expect(updatePageNumberSpy).toHaveBeenCalledTimes(1);
        expect(updatePageNumberSpy).toHaveBeenLastCalledWith(x);
    })
    
    test('Test managePageInput', async ()=>{
        let max = 10;
        
        let getPageInfoSpy = jest.spyOn(mockMainUi, "getPageInfo");
        getPageInfoSpy.mockImplementation(()=> ({availablePages: max}));
        
        let updatePageInputValueSpy = jest.spyOn(mockMainUi, "updatePageInputValue");
        updatePageInputValueSpy.mockImplementation(()=> {});
        
        let showWarningSpy = jest.spyOn(mockMainUi, "showWarning");
        showWarningSpy.mockImplementation(()=> {});
        
        let testWithPageLower ={target:{value:0}}; 
        let testWithPageHigher ={target:{value:max+1}}; 
        let testWithPageAverage ={target:{value:max/2}}; 
        
        pokedex.managePageInput(testWithPageLower);
        expect(getPageInfoSpy).toHaveBeenCalledTimes(1);
        expect(updatePageInputValueSpy).toHaveBeenCalledTimes(1);
        expect(showWarningSpy).toHaveBeenCalledTimes(1);
        expect(showWarningSpy).toHaveBeenLastCalledWith('La pagina debe ser igual o meyor a 1');
        
        pokedex.managePageInput(testWithPageHigher);
        expect(getPageInfoSpy).toHaveBeenCalledTimes(2);
        expect(updatePageInputValueSpy).toHaveBeenCalledTimes(2);
        expect(showWarningSpy).toHaveBeenCalledTimes(2);
        expect(showWarningSpy).toHaveBeenLastCalledWith(`La pagina debe ser menor o igual a ${max}`);
        
        let updatePageNumberSpy = jest.spyOn(mockMainUi, "updatePageNumber");
        updatePageNumberSpy.mockImplementation(()=> {});
        
        let preparePageForUpdateSpy = jest.spyOn(mockMainUi, "preparePageForUpdate");
        preparePageForUpdateSpy.mockImplementation(()=> {});
        
        let requestPokemonsListSpy = jest.spyOn(mockService, "requestPokemonsList");
        requestPokemonsListSpy.mockImplementation(()=> "test");
        
        let createCardsSpy = jest.spyOn(mockMainUi, "createCards");
        createCardsSpy.mockImplementation(()=> {});
        await pokedex.managePageInput(testWithPageAverage);
        expect(updatePageNumberSpy).toHaveBeenCalledTimes(1);
        expect(updatePageNumberSpy).toHaveBeenLastCalledWith(0, (testWithPageAverage.target.value)-1);
        expect(preparePageForUpdateSpy).toHaveBeenCalledTimes(1);
        expect(getPageInfoSpy).toHaveBeenCalledTimes(4);
        expect(requestPokemonsListSpy).toHaveBeenCalledTimes(1);
        expect(createCardsSpy).toHaveBeenCalledTimes(1);
        expect(createCardsSpy).toHaveBeenLastCalledWith("test");
    })
})

test('getPokemonDetails', async ()=>{
    let firstTestExample={target:{tagName: 'SECTION',id: 'pokemon-1'}};
    let secondTestExample={target:{tagName: 'ARTICLE',id: 'pokemon-2'}};
    let thirdTestExample={target:{tagName:'OTHER',parentElement: {id: 'pokemon-3'}}};

    let requestPokemonDetailsSpy = jest.spyOn(mockService, "requestPokemonDetails");
    requestPokemonDetailsSpy.mockImplementation(()=> "test");

    let showPokemonDetailsSpy = jest.spyOn(mockOverlayUi, "showPokemonDetails");
    showPokemonDetailsSpy.mockImplementation(()=> {});

    pokedex.getPokemonDetails(firstTestExample);
    expect(requestPokemonDetailsSpy).not.toHaveBeenCalled();

    await pokedex.getPokemonDetails(secondTestExample);
    expect(requestPokemonDetailsSpy).toHaveBeenCalledTimes(1);
    expect(requestPokemonDetailsSpy).toHaveBeenLastCalledWith("2");
    expect(showPokemonDetailsSpy).toHaveBeenCalledTimes(1);
    expect(showPokemonDetailsSpy).toHaveBeenLastCalledWith("test");

    await pokedex.getPokemonDetails(thirdTestExample);
    expect(requestPokemonDetailsSpy).toHaveBeenCalledTimes(2);
    expect(requestPokemonDetailsSpy).toHaveBeenLastCalledWith("3");
    expect(showPokemonDetailsSpy).toHaveBeenCalledTimes(2);
    expect(showPokemonDetailsSpy).toHaveBeenLastCalledWith("test");

    jest.clearAllMocks();
})

test('Verify current page', async ()=>{
    let getPageInfoSpy = jest.spyOn(mockMainUi, "getPageInfo");
    getPageInfoSpy.mockImplementation(()=> ({page:1, cardsPerPage:10}));
    
    let updatePageNumberSpy = jest.spyOn(mockMainUi, "updatePageNumber");
    updatePageNumberSpy.mockImplementation((n)=> n);
    
    let preparePageForUpdateSpy = jest.spyOn(mockMainUi, "preparePageForUpdate");
    preparePageForUpdateSpy.mockImplementation(()=> {});
    
    let requestPokemonsListSpy = jest.spyOn(mockService, "requestPokemonsList");
    requestPokemonsListSpy.mockImplementation(()=> "test");
    
    let createCardsSpy = jest.spyOn(mockMainUi, "createCards");
    createCardsSpy.mockImplementation(()=> {});
    
    let caseSamePage = {firstElementChild:{id:"details-pokemon-18"}};
    let caseDifferentPage = {firstElementChild:{id:"details-pokemon-80"}};

    let getOverlaySpy = jest.spyOn(mockOverlayUi, "getOverlay");
    getOverlaySpy.mockImplementation(()=> caseSamePage);
    
    pokedex.verifyCurrentPage();
    expect(getPageInfoSpy).toHaveBeenCalledTimes(1);
    expect(getOverlaySpy).toHaveBeenCalledTimes(1);
    expect(updatePageNumberSpy).not.toHaveBeenCalled();
    
    getOverlaySpy.mockImplementation(()=> caseDifferentPage);
    await pokedex.verifyCurrentPage();
    expect(getOverlaySpy).toHaveBeenCalledTimes(2);
    expect(updatePageNumberSpy).toHaveBeenCalledTimes(1);
    expect(updatePageNumberSpy).toHaveBeenLastCalledWith(0, Math.floor((80-1)/10));
    expect(preparePageForUpdateSpy).toHaveBeenCalledTimes(1);
    expect(getPageInfoSpy).toHaveBeenCalledTimes(3);
    expect(requestPokemonsListSpy).toHaveBeenCalledTimes(1);
    expect(createCardsSpy).toHaveBeenCalledTimes(1);
    expect(createCardsSpy).toHaveBeenLastCalledWith("test");

    jest.clearAllMocks();
})

test('GetTypeDetails', async ()=>{
    let example = {target:{tagName:"OTHER",parentElement:{tagName:"BUTTON", id: "test1"}}};

    let requestTypeDetailsSpy = jest.spyOn(mockService, "requestTypeDetails");
    requestTypeDetailsSpy.mockImplementation(()=> "test2");

    let showTypeDetailsSpy = jest.spyOn(mockOverlayUi, "showTypeDetails");
    showTypeDetailsSpy.mockImplementation(()=> {});

    await pokedex.getTypeDetails(example);

    expect(requestTypeDetailsSpy).toHaveBeenCalledTimes(1);
    expect(requestTypeDetailsSpy).toHaveBeenLastCalledWith("test1");
    expect(showTypeDetailsSpy).toHaveBeenCalledTimes(1);
    expect(showTypeDetailsSpy).toHaveBeenLastCalledWith("test2");

    jest.clearAllMocks();
})

test('getSiblingDetails', async ()=>{
    document.body.innerHTML = '<div class="type-details"></div><div class="next-pokemon"></div><div class="previous-pokemon"></div>'

    let nextPokemon=document.querySelector('.next-pokemon');
    let previousPokemon=document.querySelector('.previous-pokemon');

    let nextPokemonCase={target: nextPokemon};
    let previousPokemonCase={target: previousPokemon};

    let x = 5;
    
    let getPokemonDetailsContainerSpy = jest.spyOn(mockOverlayUi, "getPokemonDetailsContainer");
    getPokemonDetailsContainerSpy.mockImplementation(()=> ({id: `details-pokemon-${x}`}));
    
    let pullOutTypeDetailsSpy = jest.spyOn(mockOverlayUi, "pullOutTypeDetails");
    pullOutTypeDetailsSpy.mockImplementation(()=> {document.querySelector('.type-details').remove()});

    let requestPokemonDetailsSpy = jest.spyOn(mockService, "requestPokemonDetails");
    requestPokemonDetailsSpy.mockImplementation((n)=> "test"+n);

    let showPokemonDetailsSpy = jest.spyOn(mockOverlayUi, "showPokemonDetails");
    showPokemonDetailsSpy.mockImplementation(()=> {});

    await pokedex.getSiblingDetails(nextPokemonCase);
    expect(getPokemonDetailsContainerSpy).toHaveBeenCalledTimes(1);
    expect(pullOutTypeDetailsSpy).toHaveBeenCalledTimes(1);
    expect(requestPokemonDetailsSpy).toHaveBeenCalledTimes(1);
    expect(requestPokemonDetailsSpy).toHaveBeenLastCalledWith(x+1);
    expect(showPokemonDetailsSpy).toHaveBeenCalledTimes(1);
    expect(showPokemonDetailsSpy).toHaveBeenLastCalledWith(`test${x+1}`);

    await pokedex.getSiblingDetails(previousPokemonCase);
    expect(getPokemonDetailsContainerSpy).toHaveBeenCalledTimes(2);
    expect(pullOutTypeDetailsSpy).toHaveBeenCalledTimes(1);
    expect(requestPokemonDetailsSpy).toHaveBeenCalledTimes(2);
    expect(requestPokemonDetailsSpy).toHaveBeenLastCalledWith(x-1);
    expect(showPokemonDetailsSpy).toHaveBeenCalledTimes(2);
    expect(showPokemonDetailsSpy).toHaveBeenLastCalledWith(`test${x-1}`);
})