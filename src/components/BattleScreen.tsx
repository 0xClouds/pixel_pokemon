"use client";

import React from "react";
import { useGameStore } from "../game/store";

const BattleScreen: React.FC = () => {
  const battle = useGameStore((state) => state.battle);
  const attackWildPokemon = useGameStore((state) => state.attackWildPokemon);
  const catchPokemon = useGameStore((state) => state.catchPokemon);
  const runFromBattle = useGameStore((state) => state.runFromBattle);

  if (!battle.inBattle || !battle.playerPokemon || !battle.wildPokemon) {
    return null;
  }

  const playerPokemon = battle.playerPokemon;
  const wildPokemon = battle.wildPokemon;
  const isPlayerTurn = battle.turn === "player";

  // Calculate health bar percentages
  const playerHealthPercent = (playerPokemon.hp / playerPokemon.maxHp) * 100;
  const wildHealthPercent = (wildPokemon.hp / wildPokemon.maxHp) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-10 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full overflow-hidden">
        {/* Battle Arena */}
        <div className="bg-gradient-to-b from-green-200 to-green-400 p-6 relative">
          {/* Wild Pokemon */}
          <div className="mb-6 flex justify-end">
            <div className="bg-white rounded-lg shadow p-2 flex items-start gap-4">
              <div className="flex flex-col">
                <span className="font-bold">{wildPokemon.name}</span>
                <span className="text-xs">Lv.{wildPokemon.level}</span>
                <div className="mt-1 h-3 w-28 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full ${
                      wildHealthPercent > 50
                        ? "bg-green-500"
                        : wildHealthPercent > 20
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${wildHealthPercent}%` }}
                  ></div>
                </div>
                <div className="text-xs mt-1 font-semibold">
                  {wildPokemon.hp}/{wildPokemon.maxHp} HP
                </div>
              </div>
              <div className="h-16 w-16 flex items-center justify-center">
                <img
                  src={wildPokemon.sprite.src}
                  alt={wildPokemon.name}
                  className="w-full h-full object-contain pixelated"
                />
              </div>
            </div>
          </div>

          {/* Player Pokemon */}
          <div className="flex justify-start">
            <div className="bg-white rounded-lg shadow p-2 flex items-start gap-4">
              <div className="h-16 w-16 flex items-center justify-center">
                <img
                  src={playerPokemon.sprite.src}
                  alt={playerPokemon.name}
                  className="w-full h-full object-contain pixelated"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold">{playerPokemon.name}</span>
                <span className="text-xs">Lv.{playerPokemon.level}</span>
                <div className="mt-1 h-3 w-28 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full ${
                      playerHealthPercent > 50
                        ? "bg-green-500"
                        : playerHealthPercent > 20
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${playerHealthPercent}%` }}
                  ></div>
                </div>
                <div className="text-xs mt-1 font-semibold">
                  {playerPokemon.hp}/{playerPokemon.maxHp} HP
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Battle Message */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-center font-pixel text-lg font-bold text-gray-900">
            {battle.message}
          </p>
        </div>

        {/* Battle Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-100">
          {isPlayerTurn ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2 font-bold text-lg mb-3 text-blue-700">
                What will {playerPokemon.name} do?
              </div>

              {/* Attack options */}
              <div className="bg-white p-3 rounded shadow-md border border-gray-200">
                <h3 className="text-center font-bold mb-2 text-red-600">
                  Attack
                </h3>
                <div className="grid grid-cols-2 gap-1">
                  {playerPokemon.moves.map((move, index) => (
                    <button
                      key={move.name}
                      onClick={() => attackWildPokemon(index)}
                      className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-semibold shadow-md transition-colors"
                    >
                      {move.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Other actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={catchPokemon}
                  className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-bold shadow-md transition-colors"
                >
                  Catch
                </button>
                <button
                  onClick={runFromBattle}
                  className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-bold shadow-md transition-colors"
                >
                  Run
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center p-5 bg-gray-100 rounded-lg">
              <p className="text-lg font-bold text-orange-600 animate-pulse">
                Wait for opponent's move...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BattleScreen;
