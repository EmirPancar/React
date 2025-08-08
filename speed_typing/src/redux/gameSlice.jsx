import { createSlice } from '@reduxjs/toolkit';
import wordList from '../words.json';

const WORDS_PER_LINE = 11;
const TARGET_WORD_COUNT = 200; 
const MIN_LINE_CHARS = 45; 
const MAX_LINE_CHARS = 65; 


const generateBalancedWordSet = () => {
  const finalWords = [];
  let currentLine = [];
  let currentLength = 0;

  let safetyBreak = 0; 
  
  while (finalWords.length < TARGET_WORD_COUNT && safetyBreak < TARGET_WORD_COUNT * 5) {
    safetyBreak++;
    
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    
    const potentialLength = currentLength + randomWord.length + (currentLine.length > 0 ? 1 : 0);

    if (potentialLength <= MAX_LINE_CHARS) {
      currentLine.push(randomWord);
      currentLength = potentialLength;
    } 
    else {
      if (currentLength >= MIN_LINE_CHARS) {
        finalWords.push(...currentLine);
      }
      
      currentLine = [randomWord];
      currentLength = randomWord.length;
    }
  }

  if (currentLine.length > 0 && currentLength >= MIN_LINE_CHARS) {
      finalWords.push(...currentLine);
  }

  return finalWords;
};


const getNewGameState = () => {
  const initialWords = generateBalancedWordSet();

  if (initialWords.length < 45) {
      for (let i = initialWords.length; i < 200; i++) {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        initialWords.push(wordList[randomIndex]);
      }
  }

  return {
    allWords: initialWords,
    wordStatuses: Array(initialWords.length).fill(null),
    currentWordIndex: 0,
    userInput: '',
    timer: 60,
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
          for (let i = 0; i < 45; i++) {
              const randomIndex = Math.floor(Math.random() * wordList.length);
              newWords.push(wordList[randomIndex]);
          }
          state.allWords.push(...newWords);
          state.wordStatuses.push(...Array(45).fill(null));
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