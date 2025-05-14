# Pixel Pokemon Game

A browser-based pixel art style Pokemon game built with Next.js and TypeScript. This game allows players to explore a simple world, encounter Pokemon, battle them, and catch them.

## Features

- Pixel art style reminiscent of classic Pokemon games
- Character movement with arrow keys (keyboard) or on-screen controls (mobile)
- Explorable game world
- Random Pokemon encounters in designated areas
- Turn-based battle system
- Ability to catch Pokemon and build your collection
- Responsive design for both desktop and mobile

## Technologies Used

- Next.js 15
- TypeScript
- React
- Zustand (for state management)
- Tailwind CSS
- HTML5 Canvas

## Getting Started

### Prerequisites

- Node.js 18.17 or later

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/pixel-pokemon-game.git
   cd pixel-pokemon-game
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Run the development server:

   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to play the game.

## How to Play

- Use the arrow keys on your keyboard or the on-screen controls on mobile to move your character
- Walk through the game world to explore
- When you walk in designated areas (like tall grass), you have a chance to encounter wild Pokemon
- During a battle:
  - Choose from your Pokemon's moves to attack
  - Try to catch the wild Pokemon
  - Run from the battle if needed
- Heal your Pokemon using the "Heal All Pokemon" button

## Deployment

This game is configured to be easily deployed to Vercel:

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Deploy!

Alternatively, you can deploy from the command line:

```
npm run build
vercel --prod
```

## Project Structure

- `/app` - Next.js app router files
- `/src` - Source code
  - `/components` - React components
  - `/game` - Game logic and state management
  - `/hooks` - Custom React hooks
  - `/types` - TypeScript type definitions
- `/public` - Static assets
  - `/assets` - Game assets (sprites, audio, etc.)

## Future Enhancements

- Add more Pokemon
- Implement a more complex battle system
- Add NPCs and quests
- Implement a save system
- Add more game areas to explore
- Enhance sprite animations

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Pokemon sprites from [PokeAPI](https://github.com/PokeAPI/sprites)
- Inspired by the classic Pokemon games by Game Freak and Nintendo
# pixel_pokemon
