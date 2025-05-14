import { NextRequest, NextResponse } from "next/server";

// Sample database of Pokemon
const pokemonDatabase = [
  {
    id: 1,
    name: "Bulbasaur",
    type: ["grass", "poison"],
    baseStats: {
      hp: 45,
      attack: 49,
      defense: 49,
      speed: 45,
    },
    moves: ["Tackle", "Growl", "Vine Whip", "Razor Leaf"],
    sprite: "/assets/sprites/bulbasaur.png",
  },
  {
    id: 4,
    name: "Charmander",
    type: ["fire"],
    baseStats: {
      hp: 39,
      attack: 52,
      defense: 43,
      speed: 65,
    },
    moves: ["Scratch", "Growl", "Ember", "Flamethrower"],
    sprite: "/assets/sprites/charmander.png",
  },
  {
    id: 7,
    name: "Squirtle",
    type: ["water"],
    baseStats: {
      hp: 44,
      attack: 48,
      defense: 65,
      speed: 43,
    },
    moves: ["Tackle", "Tail Whip", "Bubble", "Water Gun"],
    sprite: "/assets/sprites/squirtle.png",
  },
];

// GET handler - Returns all Pokemon or a specific one if id is provided
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const pokemon = pokemonDatabase.find((p) => p.id === parseInt(id));

    if (!pokemon) {
      return NextResponse.json({ error: "Pokemon not found" }, { status: 404 });
    }

    return NextResponse.json(pokemon);
  }

  return NextResponse.json(pokemonDatabase);
}

// POST handler - Generate a random Pokemon
export async function POST(request: NextRequest) {
  try {
    const { level } = await request.json();

    // Select a random Pokemon from our database
    const randomPokemon =
      pokemonDatabase[Math.floor(Math.random() * pokemonDatabase.length)];

    // Scale stats based on level (simple formula)
    const pokemonLevel = level || Math.floor(Math.random() * 10) + 1;
    const scaleFactor = 1 + (pokemonLevel / 100) * 2;

    const generatedPokemon = {
      ...randomPokemon,
      level: pokemonLevel,
      stats: {
        hp: Math.floor(randomPokemon.baseStats.hp * scaleFactor),
        attack: Math.floor(randomPokemon.baseStats.attack * scaleFactor),
        defense: Math.floor(randomPokemon.baseStats.defense * scaleFactor),
        speed: Math.floor(randomPokemon.baseStats.speed * scaleFactor),
      },
      moves: randomPokemon.moves.slice(
        0,
        2 + Math.min(2, Math.floor(pokemonLevel / 10))
      ),
    };

    return NextResponse.json(generatedPokemon);
  } catch (err) {
    // eslint-disable-next-line no-console -- helpful for debugging on the server
    console.error("Failed to generate Pokémon:", err);
    return NextResponse.json(
      { error: "Failed to generate Pokemon" },
      { status: 400 }
    );
  }
}
