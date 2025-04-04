import { Router } from "express";
import { validatePokemon, parcialValidatePokemon } from '../schema/schemaPokemon.js';
import { PokemonModel } from "../models/pokemon.js";
//import pokemones from '../pokemons/pokedex.json' with { type: 'json' };



//const require = createRequire(import.meta.url);
//export const pokemones = require('../pokemons/pokedex.json');

// export const tipos = require('../pokemons/pokedex.json');
// export const objetos = require('../pokemons/items.json');
// export const movimientos = require('../pokemons/moves.json');



export const pokemonRouter = Router();

pokemonRouter.get('/', async (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin', '*'); // Permite cualquier origen
    const { type, name } = req.query;
    const pokemones = await PokemonModel.getAll({type, name})
    
    res.json(pokemones)
    
});

pokemonRouter.get('/:id', async (req, res) =>{
    const {id} =req.params
    const pokemon = await PokemonModel.getById({id})
    if(pokemon){
        console.log('salidapokemon', pokemon.name.english)
        res.json(pokemon)
    } else {
        res.status(404).json({error: 'id de Pokemon no encontrado'})
    }
})

// pokemonRouter.get('/name/:name', (req, res) =>{
//     const {name} = req.params
    
//     const pokemon = pokemones.find(pokemon => pokemon.name.english.toLowerCase() == name.toLowerCase())
//     if(pokemon){
//         res.json(pokemon)
//     } else {
//         res.status(404).json({error: 'nombre de Pokemon no encontrado'})
//     }
// })

// pokemonRouter.get('/pokemones/type/:type', (req, res) =>{
//     const {type} = req.params
    
//     const pokemon = pokemones.find(pokemon => pokemon.type == type.toLowerCase())
//     if(pokemon){
//         res.json(pokemon)
//     } else {
//         res.status(404).json({error: 'tipo de Pokemon no encontrado'})
//     }
// })

pokemonRouter.post('/', (req, res) =>{
    const result = validatePokemon(req.body)

    if(result.error){
        return res.status(400).json({error: JSON.parse(
            result.error.message)
    })
    }
    const newPokemon = {
        id: pokemones.length + 1,
        ...result.data
    }
    pokemones.push(newPokemon)

    res.status(201).json(newPokemon) //201 es el codigo de status de creado
    
})

pokemonRouter.patch('/:id', (req,res) =>{
        const result = parcialValidatePokemon(req.body)
    
        if(result.error){
            return res.status(400).json({error: JSON.parse(
                result.error.message)
        })
        } 
        const {id} = req.params
    
        const pokemonIndex = pokemones.findIndex(pokemon => pokemon.id == id)
        if(pokemonIndex === -1){
            return res.status(404).json({message: 'id de Pokemon no encontrado'})
        }
    
        const updatePokemon = {
            ...pokemones[pokemonIndex],
            ...result.data
        }
    
        pokemones[pokemonIndex] = updatePokemon
        return res.json(updatePokemon)
    
})

pokemonRouter.delete('/:id', (req,res) =>{
    const {id} = req.params
    const pokemonIndex = pokemones.findIndex(pokemon => pokemon.id == id)
    if(pokemonIndex === -1){
        return res.status(404).json({message: 'id de Pokemon no encontrado'})
    }
    pokemones.splice(pokemonIndex, 1)
    res.json({message: 'Pokemon eliminado'})

})

