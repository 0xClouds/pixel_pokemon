// Game Types

// Position type
export interface Position {
  x: number;
  y: number;
}

// Direction enum
export enum Direction {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right",
}

// Sprite type
export interface Sprite {
  src: string;
  width: number;
  height: number;
}

// Player type
export interface Player {
  position: Position;
  direction: Direction;
  sprite: Sprite;
  isMoving: boolean;
}

// Tile type
export interface Tile {
  id: number;
  walkable: boolean;
  encounterRate?: number; // Pokemon encounter rate (0-100)
}

// Map type
export interface GameMap {
  width: number;
  height: number;
  tileSize: number;
  tilesetSrc: string;
  tiles: number[][];
  collisionMap: boolean[][];
  encounterZones: {
    x: number;
    y: number;
    width: number;
    height: number;
    pokemons: Pokemon[];
    encounterRate: number; // 0-100
  }[];
}

// Pokemon type
export interface Pokemon {
  id: number;
  name: string;
  level: number;
  type: string[];
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  moves: PokemonMove[];
  sprite: Sprite;
}

// Pokemon move type
export interface PokemonMove {
  name: string;
  type: string;
  power: number;
  accuracy: number; // 0-100
}

// Battle state
export interface Battle {
  inBattle: boolean;
  playerPokemon: Pokemon | null;
  wildPokemon: Pokemon | null;
  turn: "player" | "opponent";
  message: string;
}

// Game state
export interface GameState {
  player: Player;
  map: GameMap;
  battle: Battle;
  pokemons: Pokemon[];
  inventory: any[]; // Will expand later
  isLoading: boolean;
  isPaused: boolean;
}
