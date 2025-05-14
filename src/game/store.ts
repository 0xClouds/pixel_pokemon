import { create } from "zustand";
import { GameState, Direction, Position, Pokemon } from "../types/game";

// Initial state for our game
const initialState: GameState = {
  player: {
    position: { x: 5, y: 5 },
    direction: Direction.DOWN,
    sprite: {
      src: "/assets/sprites/player.png",
      width: 32,
      height: 32,
    },
    isMoving: false,
  },
  map: {
    width: 20,
    height: 15,
    tileSize: 32,
    tilesetSrc: "/assets/sprites/tileset.png",
    tiles: Array(15).fill(Array(20).fill(0)), // Simple map with all grass
    collisionMap: Array(15).fill(Array(20).fill(false)), // No collisions by default
    encounterZones: [
      {
        x: 2,
        y: 2,
        width: 10,
        height: 10,
        pokemons: [],
        encounterRate: 10,
      },
    ],
  },
  battle: {
    inBattle: false,
    playerPokemon: null,
    wildPokemon: null,
    turn: "player",
    message: "",
  },
  pokemons: [
    {
      id: 1,
      name: "Bulbasaur",
      level: 5,
      type: ["grass", "poison"],
      hp: 20,
      maxHp: 20,
      attack: 10,
      defense: 10,
      speed: 10,
      moves: [
        {
          name: "Tackle",
          type: "normal",
          power: 40,
          accuracy: 100,
        },
        {
          name: "Vine Whip",
          type: "grass",
          power: 45,
          accuracy: 100,
        },
      ],
      sprite: {
        src: "/assets/sprites/bulbasaur.png",
        width: 64,
        height: 64,
      },
    },
  ],
  inventory: [],
  isLoading: false,
  isPaused: false,
};

export interface GameActions {
  movePlayer: (direction: Direction) => void;
  startBattle: (wildPokemon: Pokemon) => void;
  endBattle: () => void;
  attackWildPokemon: (moveIndex: number) => void;
  catchPokemon: () => void;
  runFromBattle: () => void;
  healPokemons: () => void;
}

// Create the game store
export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,

  // Movement action
  movePlayer: (direction: Direction) => {
    const { player, map } = get();
    const newPosition: Position = { ...player.position };

    // Calculate new position based on direction
    switch (direction) {
      case Direction.UP:
        newPosition.y = Math.max(0, player.position.y - 1);
        break;
      case Direction.DOWN:
        newPosition.y = Math.min(map.height - 1, player.position.y + 1);
        break;
      case Direction.LEFT:
        newPosition.x = Math.max(0, player.position.x - 1);
        break;
      case Direction.RIGHT:
        newPosition.x = Math.min(map.width - 1, player.position.x + 1);
        break;
    }

    // Check collision
    const collisionMap = map.collisionMap;
    if (
      collisionMap[newPosition.y] &&
      collisionMap[newPosition.y][newPosition.x]
    ) {
      // Just update direction if we hit a collision
      set({ player: { ...player, direction } });
      return;
    }

    // Update player position and direction
    set({
      player: {
        ...player,
        position: newPosition,
        direction,
        isMoving: true,
      },
    });

    // Check for Pokemon encounter
    const { encounterZones } = map;
    for (const zone of encounterZones) {
      if (
        newPosition.x >= zone.x &&
        newPosition.x < zone.x + zone.width &&
        newPosition.y >= zone.y &&
        newPosition.y < zone.y + zone.height
      ) {
        // Random encounter check
        if (Math.random() * 100 < zone.encounterRate) {
          // We have a Pokemon encounter!
          // For now, just use a random Pokemon (we'd expand this later)
          const typeIndex = Math.floor(Math.random() * 3);
          const types = ["grass", "fire", "water"];
          const wildPokemon: Pokemon = {
            id: Math.floor(Math.random() * 3) + 1,
            name: ["Bulbasaur", "Charmander", "Squirtle"][
              Math.floor(Math.random() * 3)
            ],
            level: Math.floor(Math.random() * 5) + 1,
            type: [types[typeIndex]],
            hp: 20,
            maxHp: 20,
            attack: 10,
            defense: 10,
            speed: 10,
            moves: [
              {
                name: "Tackle",
                type: "normal",
                power: 40,
                accuracy: 100,
              },
            ],
            sprite: {
              src: `/assets/sprites/${
                ["bulbasaur", "charmander", "squirtle"][
                  Math.floor(Math.random() * 3)
                ]
              }.png`,
              width: 64,
              height: 64,
            },
          };
          get().startBattle(wildPokemon);
          break;
        }
      }
    }

    // Stop moving after a short delay (simulating animation)
    setTimeout(() => {
      set((state) => ({
        player: { ...state.player, isMoving: false },
      }));
    }, 200);
  },

  // Battle actions
  startBattle: (wildPokemon: Pokemon) => {
    set({
      battle: {
        inBattle: true,
        playerPokemon: get().pokemons[0], // Use first Pokemon in the player's roster
        wildPokemon,
        turn: "player",
        message: `A wild ${wildPokemon.name} appeared!`,
      },
    });
  },

  endBattle: () => {
    set({
      battle: {
        ...initialState.battle,
      },
    });
  },

  attackWildPokemon: (moveIndex: number) => {
    const { battle } = get();
    if (!battle.inBattle || !battle.playerPokemon || !battle.wildPokemon)
      return;

    const playerPokemon = battle.playerPokemon;
    const wildPokemon = battle.wildPokemon;
    const move = playerPokemon.moves[moveIndex];

    if (!move) return;

    // Calculate damage (simplified)
    const damage = Math.floor(
      ((playerPokemon.level * 0.4 + 2) *
        move.power *
        (playerPokemon.attack / wildPokemon.defense)) /
        50 +
        2
    );

    // Apply damage
    const newWildHP = Math.max(0, wildPokemon.hp - damage);

    set({
      battle: {
        ...battle,
        wildPokemon: {
          ...wildPokemon,
          hp: newWildHP,
        },
        message: `${playerPokemon.name} used ${move.name}! It did ${damage} damage!`,
        turn: "opponent",
      },
    });

    // Check if the wild Pokemon fainted
    if (newWildHP <= 0) {
      setTimeout(() => {
        set({
          battle: {
            ...get().battle,
            message: `${wildPokemon.name} fainted! You won!`,
          },
        });

        // End battle after showing win message
        setTimeout(() => {
          get().endBattle();
        }, 2000);
      }, 1000);
      return;
    }

    // Wild Pokemon's turn
    setTimeout(() => {
      const { battle } = get();
      if (!battle.inBattle) return; // Battle might have ended

      // Wild Pokemon attacks with a random move
      const wildMove =
        wildPokemon.moves[Math.floor(Math.random() * wildPokemon.moves.length)];

      // Calculate damage (simplified)
      const wildDamage = Math.floor(
        ((wildPokemon.level * 0.4 + 2) *
          wildMove.power *
          (wildPokemon.attack / playerPokemon.defense)) /
          50 +
          2
      );

      // Apply damage
      const newPlayerHP = Math.max(0, playerPokemon.hp - wildDamage);

      set({
        battle: {
          ...battle,
          playerPokemon: {
            ...playerPokemon,
            hp: newPlayerHP,
          },
          message: `${wildPokemon.name} used ${wildMove.name}! It did ${wildDamage} damage!`,
          turn: "player",
        },
      });

      // Check if player's Pokemon fainted
      if (newPlayerHP <= 0) {
        setTimeout(() => {
          set({
            battle: {
              ...get().battle,
              message: `${playerPokemon.name} fainted! You lost the battle!`,
            },
          });

          // End battle after showing loss message
          setTimeout(() => {
            get().endBattle();
          }, 2000);
        }, 1000);
      }
    }, 1500);
  },

  catchPokemon: () => {
    const { battle } = get();
    if (!battle.inBattle || !battle.wildPokemon) return;

    // Simplified catch mechanic (30% chance)
    const catchChance = 30;
    const isCaught = Math.random() * 100 < catchChance;

    if (isCaught) {
      // Add the wild Pokemon to the player's collection
      set({
        pokemons: [...get().pokemons, battle.wildPokemon],
        battle: {
          ...battle,
          message: `You caught ${battle.wildPokemon.name}!`,
        },
      });

      // End battle after showing catch message
      setTimeout(() => {
        get().endBattle();
      }, 2000);
    } else {
      set({
        battle: {
          ...battle,
          message: "The Pokemon broke free!",
          turn: "opponent",
        },
      });

      // Wild Pokemon's turn after failed catch
      setTimeout(() => {
        // Simplified: Wild Pokemon attacks after a failed catch
        get().attackWildPokemon(0); // This will trigger the wild Pokemon's attack
      }, 1500);
    }
  },

  runFromBattle: () => {
    // 80% chance to run
    const runChance = 80;
    const canRun = Math.random() * 100 < runChance;

    if (canRun) {
      set({
        battle: {
          ...get().battle,
          message: "Got away safely!",
        },
      });

      // End battle after showing run message
      setTimeout(() => {
        get().endBattle();
      }, 1000);
    } else {
      set({
        battle: {
          ...get().battle,
          message: "Failed to run away!",
          turn: "opponent",
        },
      });

      // Wild Pokemon's turn after failed run
      setTimeout(() => {
        // Simplified: Wild Pokemon attacks after a failed run
        get().attackWildPokemon(0); // This will trigger the wild Pokemon's attack
      }, 1500);
    }
  },

  healPokemons: () => {
    // Heal all Pokemon to full HP
    set({
      pokemons: get().pokemons.map((pokemon) => ({
        ...pokemon,
        hp: pokemon.maxHp,
      })),
    });
  },
}));
