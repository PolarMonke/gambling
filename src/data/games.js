export const allGames = [
  {
    id: 'slots',
    name: 'Slot Machine',
    image: 'src/assets/games/slots.jpg',
    component: 'SlotsGame'
  },
  {
    id: 'roulette',
    name: 'Backshot Roulette',
    image: 'src/assets/games/backshot.jpg',
    component: 'RouletteGame'
  },
  {
    id: 'minesweeper',
    name: 'Minesweeper',
    image: 'src/assets/games/minesweeper.jpg',
    component: 'MinesweeperGame'
  },
  {
    id: 'golden-rain',
    name: 'Golden Rain',
    image: 'src/assets/games/golden-rain.jpg',
    component: 'GoldenRainGame'
  }
  // Add more games here
];

export const featuredGames = allGames.slice(0, 4);