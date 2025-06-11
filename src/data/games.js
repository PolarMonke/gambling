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
    id: 'golden-shower',
    name: 'Golden Shower',
    image: 'src/assets/games/golden-rain.jpg',
    component: 'GoldenShowerGame'
  }
];

export const featuredGames = allGames.slice(0, 4);