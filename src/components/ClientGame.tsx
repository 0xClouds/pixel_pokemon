"use client"; // This marks the component as a Client Component

import dynamic from "next/dynamic";

// Use dynamic import with no SSR for the Game component
// This is needed because we use browser-only APIs like Canvas
const Game = dynamic(() => import("./Game"), { ssr: false });

export default function ClientGame() {
  return <Game />;
}
