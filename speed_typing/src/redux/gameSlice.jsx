import { createSlice } from '@reduxjs/toolkit';
import wordList from '../words.json';

const WORDS_PER_LINE = 11;

const getNewGameState = () => {
  let initialWords = [];
  for (let i = 0; i < 200; i++) {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    initialWords.push(wordList[randomIndex]);
  }

  return {
    allWords: initialWords,
    wordStatuses: Array(initialWords.length).fill(null),
    currentWordIndex: 0,
    userInput: '',
    timer: 10,
    gameStatus: 'waiting',
    isModalOpen: false,
    stats: {
      wpm: 0,
      correctWords: 0,
      wrongWords: 0,
      accuracy: 0,
    },
  };
};

const gameSlice = createSlice({
  name: 'game',
  initialState: getNewGameState(),
  reducers: {
    resetGame: (state) => {
      Object.assign(state, getNewGameState());
    },
    setUserInput: (state, action) => {
      state.userInput = action.payload;
    },
    processCurrentWord: (state) => {
      const currentWord = state.allWords[state.currentWordIndex];
      const isCorrect = currentWord === state.userInput.trim();
      
      state.wordStatuses[state.currentWordIndex] = isCorrect;
      state.currentWordIndex++;
      state.userInput = '';

      if (state.currentWordIndex > state.allWords.length - (WORDS_PER_LINE * 5)) {
          let newWords = [];
          for (let i = 0; i < 50; i++) {
              const randomIndex = Math.floor(Math.random() * wordList.length);
              newWords.push(wordList[randomIndex]);
          }
          state.allWords.push(...newWords);
          state.wordStatuses.push(...Array(50).fill(null));
      }
    },
    startGame: (state) => {
      if (state.gameStatus === 'waiting') {
        state.gameStatus = 'running';
      }
    },
    decrementTimer: (state) => {
      if (state.timer > 0) {
        state.timer--;
      }
    },
    endGame: (state) => {
      if (state.gameStatus !== 'running') return;
      state.gameStatus = 'finished';
      state.isModalOpen = true;

      const typedWordsCount = state.currentWordIndex;
      const correctWords = state.wordStatuses.filter(s => s === true).length;
      const wrongWords = state.wordStatuses.filter(s => s === false).length;
      const accuracy = typedWordsCount > 0 ? (correctWords / typedWordsCount) * 100 : 0;
      
      let totalCorrectChars = 0;
      for (let i = 0; i < state.currentWordIndex; i++) {
          if (state.wordStatuses[i] === true) {
              totalCorrectChars += state.allWords[i].length;
          }
      }
      
      const wpm = Math.round(totalCorrectChars / 5);

      state.stats = {
          wpm: wpm,
          correctWords: correctWords,
          wrongWords: wrongWords,
          accuracy: Math.round(accuracy),
      };
    }
  },
});

export const { 
    resetGame, 
    setUserInput, 
    processCurrentWord, 
    startGame, 
    decrementTimer, 
    endGame 
} = gameSlice.actions;

export default gameSlice.reducer;