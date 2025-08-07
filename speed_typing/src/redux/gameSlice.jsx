import { createSlice } from '@reduxjs/toolkit';
import wordList from '../words.json';

const WORD_COUNT_IN_VIEW = 40; 


const generateRandomWords = (count) => {
  let words = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    words.push(wordList[randomIndex]);
  }
  return words;
};


const getNewGameState = () => {
  const initialWords = generateRandomWords(WORD_COUNT_IN_VIEW);
  return {
    wordsToDisplay: initialWords, 
    wordStatuses: Array(initialWords.length).fill(null),
    currentWordIndex: 0,
    userInput: '',
    timer: 60,
    gameStatus: 'waiting',
    isModalOpen: false,
    stats: { wpm: 0, correctWords: 0, wrongWords: 0, accuracy: 0 },
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
      const currentWord = state.wordsToDisplay[state.currentWordIndex];
      const isCorrect = currentWord === state.userInput.trim();
      
      state.wordStatuses[state.currentWordIndex] = isCorrect;
      state.currentWordIndex++;
      state.userInput = '';


      if (state.currentWordIndex > state.wordsToDisplay.length / 2) {
          const newWords = generateRandomWords(20); 
          state.wordsToDisplay.push(...newWords);
          state.wordStatuses.push(...Array(newWords.length).fill(null));
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
        
        const totalCorrectChars = state.wordsToDisplay
            .slice(0, state.currentWordIndex)
            .reduce((acc, word, index) => {
                return state.wordStatuses[index] === true ? acc + word.length + 1 : acc;
            }, 0);

        state.stats = {
            wpm: Math.round(totalCorrectChars / 5),
            correctWords,
            wrongWords,
            accuracy: Math.round(accuracy),
        };
    },
  },
});

export const { resetGame, setUserInput, processCurrentWord, startGame, decrementTimer, endGame } = gameSlice.actions;
export default gameSlice.reducer;