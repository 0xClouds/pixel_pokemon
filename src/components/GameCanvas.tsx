"use client";

import React, { useRef, useEffect, useState } from "react";
import { useGameStore } from "../game/store";
import { Direction } from "../types/game";

const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 640, height: 480 });

  // Get game state from store
  const player = useGameStore((state) => state.player);
  const map = useGameStore((state) => state.map);
  const movePlayer = useGameStore((state) => state.movePlayer);
  const inBattle = useGameStore((state) => state.battle.inBattle);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (inBattle) return; // Disable movement during battle

      switch (e.key) {
        case "ArrowUp":
          movePlayer(Direction.UP);
          break;
        case "ArrowDown":
          movePlayer(Direction.DOWN);
          break;
        case "ArrowLeft":
          movePlayer(Direction.LEFT);
          break;
        case "ArrowRight":
          movePlayer(Direction.RIGHT);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [movePlayer, inBattle]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // For now, draw a simple placeholder version of the world
    // We'll update this with proper sprite rendering later

    // Draw a simple grid representing our map
    const tileSize = map.tileSize;

    // Draw the ground
    ctx.fillStyle = "#7CFC00"; // Light green grass
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw some decoration on the map - some trees and water
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        // Add some random elements to the map
        if ((x + y) % 7 === 0) {
          // Draw trees
          ctx.fillStyle = "#228B22"; // Forest green
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        } else if ((x + y) % 13 === 0) {
          // Draw water
          ctx.fillStyle = "#1E90FF"; // Dodger blue
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
      }
    }

    // Draw the player
    ctx.fillStyle = "red";
    ctx.fillRect(
      player.position.x * tileSize,
      player.position.y * tileSize,
      tileSize,
      tileSize
    );

    // Draw player direction indicator
    ctx.fillStyle = "white";
    const indicatorSize = tileSize / 4;
    const centerX = player.position.x * tileSize + tileSize / 2;
    const centerY = player.position.y * tileSize + tileSize / 2;

    switch (player.direction) {
      case Direction.UP:
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - indicatorSize);
        ctx.lineTo(centerX - indicatorSize, centerY + indicatorSize);
        ctx.lineTo(centerX + indicatorSize, centerY + indicatorSize);
        ctx.fill();
        break;
      case Direction.DOWN:
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + indicatorSize);
        ctx.lineTo(centerX - indicatorSize, centerY - indicatorSize);
        ctx.lineTo(centerX + indicatorSize, centerY - indicatorSize);
        ctx.fill();
        break;
      case Direction.LEFT:
        ctx.beginPath();
        ctx.moveTo(centerX - indicatorSize, centerY);
        ctx.lineTo(centerX + indicatorSize, centerY - indicatorSize);
        ctx.lineTo(centerX + indicatorSize, centerY + indicatorSize);
        ctx.fill();
        break;
      case Direction.RIGHT:
        ctx.beginPath();
        ctx.moveTo(centerX + indicatorSize, centerY);
        ctx.lineTo(centerX - indicatorSize, centerY - indicatorSize);
        ctx.lineTo(centerX - indicatorSize, centerY + indicatorSize);
        ctx.fill();
        break;
    }

    // Later we will add sprite-based rendering
  }, [player, map]);

  // Responsive canvas
  useEffect(() => {
    const handleResize = () => {
      // Adjust for mobile and desktop
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setCanvasSize({
          width: Math.min(window.innerWidth - 20, 400),
          height: Math.min(window.innerHeight - 150, 300),
        });
      } else {
        setCanvasSize({
          width: 640,
          height: 480,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-lg border-2 border-gray-800">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="bg-green-100"
      />
      {/* Mobile controls for touch devices */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 flex justify-center p-4 gap-2">
        <button
          className="bg-gray-700 text-white p-3 rounded-full"
          onClick={() => movePlayer(Direction.UP)}
        >
          ↑
        </button>
        <div className="flex gap-2">
          <button
            className="bg-gray-700 text-white p-3 rounded-full"
            onClick={() => movePlayer(Direction.LEFT)}
          >
            ←
          </button>
          <button
            className="bg-gray-700 text-white p-3 rounded-full"
            onClick={() => movePlayer(Direction.DOWN)}
          >
            ↓
          </button>
          <button
            className="bg-gray-700 text-white p-3 rounded-full"
            onClick={() => movePlayer(Direction.RIGHT)}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCanvas;
