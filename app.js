const express = require('express');
const cors = require('cors');
const path = require('path');

const pokemones = require('./pokemons/pokedex.json');
const tipos = require('./pokemons/types.json');
const objetos = require('./pokemons/items.json');
const movimientos = require('./pokemons/moves.json');
const {validatePokemon, parcialValidatePokemon} = require('./schema/schemaPokemon.js');

const app = express();

const port = 3000;

app.disable('x-powered-by');

app.get('/', (req, res) => {
  res.json('Hello World!');
});



app.use(cors());

//middleware para parsear el body
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));


//todos los recursos que sean pokemones se redirigen a la ruta /pokemones
app.get('/pokemones', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permite cualquier origen

    const { type, name } = req.query;

    if (type) {
        const filteredPokemonType = pokemones.filter(pokemon =>
            pokemon.type.some(g => g.toLowerCase() == type.toLowerCase())
        );
        return res.json(filteredPokemonType);
    }

    if (name) {
        const filteredPokemonName = pokemones.filter(pokemon =>
            pokemon.name.english.toLowerCase().includes(name.toLowerCase())
        );
        return res.json(filteredPokemonName);
    }

    res.json(pokemones);
});



//get para obtener los tipos de pokemones por id
app.get('/pokemones/:id', (req, res) => {
    const {id} =req.params
    const pokemon = pokemones.find(pokemon => pokemon.id == id)
    if(pokemon){
        res.json(pokemon)
    } else {
        res.status(404).json({error: 'id de Pokemon no encontrado'})
    }
})

//get para obtener los tipos de pokemones por nombre
app.get('/pokemones/name/:name', (req, res) => {
    const {name} = req.params
    this.name = name.toLowerCase()
    const pokemon = pokemones.find(pokemon => pokemon.name.english.toLowerCase() == name)
    if(pokemon){
        res.json(pokemon)
    } else {
        res.status(404).json({error: 'nombre de Pokemon no encontrado'})
    }
}) 

//get para obtener los tipos de pokemones por tipo
app.get('/pokemones/type/:type', (req, res) => {
    const {type} = req.params
    this.type = type.toLowerCase()
    const pokemon = pokemones.find(pokemon => pokemon.type == type)
    if(pokemon){
        res.json(pokemon)
    } else {
        res.status(404).json({error: 'tipo de Pokemon no encontrado'})
    }
})

////////////////////////////////////////////////////////

//crear un pokemon
app.post('/pokemones', (req, res) => {

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

//actualizar un pokemon
app.patch('/pokemones/id=:id', (req, res) => {
 
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

app.delete('/pokemones/id=:id', (req, res) => {
    const {id} = req.params
    const pokemonIndex = pokemones.findIndex(pokemon => pokemon.id == id)
    if(pokemonIndex === -1){
        return res.status(404).json({message: 'id de Pokemon no encontrado'})
    }
    pokemones.splice(pokemonIndex, 1)
    res.json({message: 'Pokemon eliminado'})

})

app.options('/pokemones', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permite cualquier origen
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS'); // Permite estos métodos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Permite estos headers
    res.json({});
})

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});