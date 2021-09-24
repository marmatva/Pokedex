export class Pokemon{
    constructor(data){
        this.id = data.id;
        this.name = data.name;
        this.height = data.height;
        this.weight = data.weight;
        this.types = data.types;

        let abilitiesResponseArray = data.abilities;
        let abilitiesNames = [];
        abilitiesResponseArray.forEach(ability =>{abilitiesNames.push(ability.ability.name)});
        this.abilities = abilitiesNames;

        let typesResponseArray = data.types;
        let typesArray = [];
        typesResponseArray.forEach(types => {
            let typeObject={}
            typeObject.name = types.type.name;
            typeObject.id = types.type.url.replace("https://pokeapi.co/api/v2/","");
            typesArray.push(typeObject);
        })
        this.types = typesArray;
    }
}

export class PokemonList{
    constructor(data){
        let listArray = [];
        data.forEach(pokemonReference =>{
            let objectPokemon = {};
            objectPokemon.name = pokemonReference.name;
            objectPokemon.id = pokemonReference.url.replace("https://pokeapi.co/api/v2/pokemon/", "").replace("/", "");
            listArray.push(objectPokemon);
        })
        return listArray;
    }
}

export class TypeRelationsDetails{
    constructor(data){
        this.typeName = data.name;

        let damageRelations = data.damage_relations;
        
        let responseArray = [[...damageRelations.double_damage_to],[...damageRelations.no_damage_from, ...damageRelations.half_damage_from], [...damageRelations.half_damage_to, ...damageRelations.no_damage_to], [...damageRelations.double_damage_from]]
        let finalArray = [];
        
        responseArray.forEach(objectsArray =>{
            let namesArray = []
            objectsArray.forEach(objectType =>{ namesArray.push(objectType.name)})
            finalArray.push(namesArray);
        })
        
        this.strengthAttack = finalArray[0];
        this.strengthDefense = finalArray[1];
        this.weakAttack = finalArray[2];
        this.weakDefense = finalArray[3];
    }
}