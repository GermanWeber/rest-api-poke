import express, { json, static as serveStatic } from 'express';
import cors from 'cors';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { pokemonRouter } from './routes/pokemones.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');



app.use(cors());

// Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//middleware para parsear el body
app.use(json());
app.use('/sound', serveStatic(join(__dirname, 'public/sound')));
app.use('/images', serveStatic(join(__dirname, 'public/images')));
app.use('/css', serveStatic(join(__dirname, 'public/css')));
app.use('/js', serveStatic(join(__dirname, 'public/js')));
app.use('/fonts', serveStatic(join(__dirname, 'public/fonts')));

app.get('/', (req, res) => {
  res.json('Hello World!');
});
//todos los recursos que sean pokemones se redirigen a la ruta /pokemones

app.use('/pokemones', pokemonRouter)

app.options('/pokemones', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permite cualquier origen
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS'); // Permite estos métodos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Permite estos headers
    res.json({});
})

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});