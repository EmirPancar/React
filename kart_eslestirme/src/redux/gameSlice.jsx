import { createSlice } from '@reduxjs/toolkit';


const SUITS = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
const RANKS = [
  'ace', 'two', 'three', 'four', 'five', 'six', 'seven', 
  'eight', 'nine', 'ten', 'jack', 'queen', 'king'
];

const generateDeck = () => {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push(`${rank}_of_${suit.toLowerCase()}`);
    }
  }
  return deck;
};


const initialState = {
  cards: [],
  flippedCards: [],
  score: 0,
  highScore: { score: 0, accuracy: 0 },
  matchesAttempted: 0,
  correctMatches: 0,
  consecutiveMisses: 0, 
  gameMode: null,
  timeLeft: 60,
  isGameActive: false,
  isModalOpen: true,
  gameStatus: 'idle',
};


export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
 
    openModal: (state) => { state.isModalOpen = true; },
    closeModal: (state) => { state.isModalOpen = false; },
    initializeGame: (state, action) => {
        const { mode } = action.payload;
        Object.assign(state, { ...initialState, highScore: state.highScore, isModalOpen: false, isGameActive: true, gameMode: mode, gameStatus: 'playing' });
        const fullDeck = generateDeck();
        const shuffledDeck = fullDeck.sort(() => 0.5 - Math.random());
        const selectedValues = shuffledDeck.slice(0, 9);
        const gameCards = [...selectedValues, ...selectedValues];
        state.cards = gameCards.sort(() => 0.5 - Math.random()).map((value, index) => ({ id: index, value: value, isFlipped: false, isMatched: false }));
    },
    flipCard: (state, action) => {
        const cardId = action.payload;
        const card = state.cards.find(c => c.id === cardId);
        if (state.isGameActive && state.flippedCards.length < 2 && card && !card.isFlipped && !card.isMatched) {
            card.isFlipped = true;
            state.flippedCards.push(card);
        }
    },
    tickTimer: (state) => {
        if (state.isGameActive && state.gameMode === 'timed' && state.timeLeft > 0) {
            state.timeLeft -= 1;
            if (state.timeLeft === 0) {
                state.isGameActive = false;
                state.gameStatus = 'lost';
            }
        }
    },


    checkMatch: (state) => {
      if (state.flippedCards.length !== 2) return;

      state.matchesAttempted += 1;
      const [card1, card2] = state.flippedCards;

      if (card1.value === card2.value) { 
        state.correctMatches += 1;
        
        let pointsWon = 0;
        if (state.consecutiveMisses === 0) {
          pointsWon = 80; 
        } else if (state.consecutiveMisses <= 2) {
          pointsWon = 50; 
        } else if (state.consecutiveMisses <= 4) {
          pointsWon = 25; 
        } else if (state.consecutiveMisses <= 6) {
          pointsWon = 10; 
        } 

        
        state.score += pointsWon;
        
        state.consecutiveMisses = 0;

        state.cards.forEach(c => {
          if (c.value === card1.value) {
            c.isMatched = true;
          }
        });

        if (state.cards.every(c => c.isMatched)) {
          state.gameStatus = 'won';
          state.isGameActive = false;
          if (state.score > state.highScore.score) {
            const accuracy = ((state.correctMatches / state.matchesAttempted) * 100).toFixed(0);
            state.highScore = { score: state.score, accuracy: accuracy };
          }
        }
      } else { 
        state.consecutiveMisses += 1;

        state.cards.forEach(c => {
          if (c.id === card1.id || c.id === card2.id) {
            c.isFlipped = false;
          }
        });
      }
      state.flippedCards = [];
    },
  },
});

export const { 
  openModal,
  closeModal,
  initializeGame, 
  flipCard,
  checkMatch,
  tickTimer,
} = gameSlice.actions;

export default gameSlice.reducer;