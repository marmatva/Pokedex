import * as storage from '../storage.js'
describe('Test Storage Module', ()=>{
    global.Storage.prototype.setItem=jest.fn();
    global.Storage.prototype.getItem=jest.fn((x)=>x);
    beforeAll(jest.clearAllMocks);
    test('Saving in local storage', ()=>{
        let objectExample={result: "test"};
        storage.saveInLocalStorage("exampleKey", objectExample);
        expect(global.Storage.prototype.setItem).toHaveBeenCalledTimes(1);
        expect(global.Storage.prototype.setItem).toHaveBeenCalledWith("exampleKey", '{"result":"test"}');
    })
    test('Getting from localStorage', ()=>{
        let result = storage.getFromLocalStorage("test");
        expect(global.Storage.prototype.getItem).toHaveBeenCalledTimes(1);
        expect(global.Storage.prototype.getItem).toHaveBeenCalledWith("test");
        expect(result).toEqual("test");
    })
})