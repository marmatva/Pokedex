export function saveInLocalStorage(key, value){
    let string = JSON.stringify(value)
    localStorage.setItem(key, string)
}

export function getFromLocalStorage(key){
    return localStorage.getItem(key);
}
