import pokemones from '../pokemons/pokedex.json' with { type: 'json' };


export class PokemonModel {
    static getAll = async ({type, name}) => {
        if (type) {
            console.log('entro en model type')
            
            return pokemones.filter(pokemon =>
                pokemon.type.some(g => g.toLowerCase() == type.toLowerCase())
            );
            
        }
        if (name) {
            console.log('entro en model name')
            return pokemones.filter(pokemon =>
                pokemon.name.english.toLowerCase().includes(name.toLowerCase())
            );
            
        }
        console.log('entro en model todos')
        return pokemones;
    }

    static getById = async ({id}) =>{
        if(id){
        const pokemon = pokemones.find(pokemon => pokemon.id == id)   
        return pokemon
        }
    }
}