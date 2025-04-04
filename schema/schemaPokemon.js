import zod from 'zod';



const pokemonSchema = zod.object({
    name: zod.object({
        english: zod.string(),
        japanese: zod.string().optional(),
        chinese: zod.string().optional(),
        french: zod.string().optional()
    }),
    type: zod.array(zod.string()),
    base: zod.object({
        hp: zod.number().int().positive(),
        attack: zod.number().int().positive(),
        defense: zod.number().int().positive(),
        speed: zod.number().int().positive(),
        height: zod.number().int().positive(),
        weight: zod.number().int().positive()
    })
})


export function validatePokemon(object) {
    return pokemonSchema.safeParse(object)
}
export function parcialValidatePokemon(object){
    return pokemonSchema.partial().safeParse(object)
}

