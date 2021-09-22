import * as pokeapi from '../pokeapi.js'

describe('Test pokeapi module', ()=>{
    global.fetch=jest.fn();
    beforeEach(jest.clearAllMocks);
    test('Request Pokemons List', async ()=>{
        global.fetch.mockImplementationOnce(()=>new Promise(r=>r({json:()=>({results:"test"})})))
        let result = await pokeapi.getApiInfo(1, 2);
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenLastCalledWith("https://pokeapi.co/api/v2/pokemon/?offset=1&limit=2");
        expect(result).toEqual("test");
    })
    test('Request Pokemon Details', async ()=>{
        global.fetch.mockImplementationOnce(()=> new Promise((r)=>r({json:()=>"test"})))
        let result = await pokeapi.getPokemonDetails(1);
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenLastCalledWith("https://pokeapi.co/api/v2/pokemon/1/");
        expect(result).toEqual("test");
    })
    test('Request Image Source', async ()=>{
        global.fetch.mockImplementationOnce(()=>new Promise(r=>r({json:()=>({sprites:{front_default:"test"}})})))
        let result = await pokeapi.getImageSrc('https://asd.com')
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith('https://asd.com');
        expect(result).toEqual("test");
    })
    test('Request Type Details', async ()=>{
        global.fetch.mockImplementationOnce(()=>new Promise(r=>r({json:()=>"test"})))
        let result = await pokeapi.fetchTypeDetails(1);
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/1');
        expect(result).toEqual("test");
    })
})