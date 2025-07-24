// src/redux/gameSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cards: [],
  score: 0,
  highScore: localStorage.getItem('highScore') || 0, // Yüksek skoru yerel depodan al
  matchesAttempted: 0,
  correctMatches: 0,
  secondsElapsed: 0,
  isGameActive: false, // Zamanlayıcıyı ve oyun durumunu kontrol etmek için
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  
  reducers: {
    initializeGame: (state) => {
      const cardCount = 18;
      // Oyun sıfırlanırken yüksek skoru koru, diğer her şeyi sıfırla
      Object.assign(state, {
        ...initialState,
        cards: Array.from({ length: cardCount }, (_, index) => ({
            id: index,
            isFlipped: false,
            isMatched: false,
            // value: ... (kartın değeri, örn: 'king', 'queen')
        })),
        highScore: state.highScore // Mevcut yüksek skoru koruyoruz
      });
      state.isGameActive = true;
    },
    
    // Bu reducer'ları kendi oyun mantığınızda dispatch etmeniz gerekecek
    incrementAttempts: (state) => {
      state.matchesAttempted += 1;
    },
    incrementCorrectMatches: (state) => {
      state.correctMatches += 1;
      state.score += 50; // Doğru eşleşme için puan
    },
    updateHighScore: (state) => {
      if (state.score > state.highScore) {
        state.highScore = state.score;
        localStorage.setItem('highScore', state.score); // Yeni yüksek skoru kaydet
      }
    },
    tickTimer: (state) => {
      if (state.isGameActive) {
        state.secondsElapsed += 1;
      }
    },
    stopGame: (state) => {
      state.isGameActive = false;
    },

    flipCard: (state, action) => {
      const cardId = action.payload;
      const card = state.cards.find(c => c.id === cardId);
      if (card && !card.isMatched && !card.isFlipped) { // Sadece eşleşmemiş ve kapalı kartları çevir
        card.isFlipped = true; 
      }
    },
  },
});

export const { 
  initializeGame, 
  flipCard,
  incrementAttempts,
  incrementCorrectMatches,
  updateHighScore,
  tickTimer,
  stopGame
} = gameSlice.actions;

export default gameSlice.reducer;