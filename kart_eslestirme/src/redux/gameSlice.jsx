import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  cards: [],
  score: 0,
  // Gelecekte eklenebilecek diğer durumlar:
  // flips: 0,
  // matchedPairs: 0,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  
  reducers: {
   
    initializeGame: (state) => {
      const cardCount = 18;
     
      state.cards = Array.from({ length: cardCount }, (_, index) => ({
        id: index,
        isFlipped: false,
        isMatched: false,
        // value: ... (kartın değeri, örn: 'king', 'queen')
      }));
    },
   
    flipCard: (state, action) => {
      const cardId = action.payload;
      const card = state.cards.find(c => c.id === cardId);
      if (card) {
        card.isFlipped = !card.isFlipped; 
      }
    },
  },
});


export const { initializeGame, flipCard } = gameSlice.actions;


export default gameSlice.reducer;