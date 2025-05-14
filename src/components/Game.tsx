"use client";

import React from "react";
import GameCanvas from "./GameCanvas";
import BattleScreen from "./BattleScreen";
import { useGameStore } from "../game/store";

const Game: React.FC = () => {
  const inBattle = useGameStore((state) => state.battle.inBattle);
  const playerPokemons = useGameStore((state) => state.pokemons);
  const healPokemons = useGameStore((state) => state.healPokemons);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
        Pixel Pokemon
      </h1>

      <div className="relative">
        <GameCanvas />
        {inBattle && <BattleScreen />}
      </div>

      {/* Game instructions */}
      <div className="mt-8 bg-gray-800 p-4 rounded-lg max-w-md text-gray-200 text-sm">
        <h2 className="text-xl font-bold mb-2 text-white">Controls</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Arrow keys to move</li>
          <li>Walk in the tall grass to encounter Pokemon</li>
          <li>Win battles to progress</li>
        </ul>
      </div>

      {/* Pokemon inventory */}
      <div className="mt-4 bg-gray-800 p-4 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-2 text-white">Your Pokemon</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {playerPokemons.map((pokemon) => (
            <div
              key={pokemon.id}
              className="bg-gray-700 rounded p-2 flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-gray-600 rounded-full overflow-hidden flex items-center justify-center">
                <img
                  src={pokemon.sprite.src}
                  alt={pokemon.name}
                  className="w-8 h-8 object-contain pixelated"
                />
              </div>
              <div>
                <div className="text-white font-semibold">{pokemon.name}</div>
                <div className="text-gray-300 text-xs">Lv.{pokemon.level}</div>
                <div className="h-1 w-16 bg-gray-500 mt-1 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      pokemon.hp > pokemon.maxHp / 2
                        ? "bg-green-500"
                        : pokemon.hp > pokemon.maxHp / 5
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${(pokemon.hp / pokemon.maxHp) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Heal button */}
        <button
          onClick={healPokemons}
          className="mt-4 w-full py-2 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded"
        >
          Heal All Pokemon
        </button>
      </div>
    </div>
  );
};

export default Game;
