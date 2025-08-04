import { createSlice } from '@reduxjs/toolkit';
import allQuestions from '../questions.json'; 


const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const initialState = {
  questions: [], 
  currentQuestionIndex: 0,
  userAnswers: [],
  timer: 120,
  status: 'idle',
  userName: '',
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startQuiz: (state, action) => {

      const allAnswers = allQuestions.map(q => q.answer);
      const selectedQuestions = shuffleArray([...allQuestions]).slice(0, 10);
      const newQuestions = selectedQuestions.map(question => {
        const correctAnswer = question.answer;
        const incorrectOptionsPool = allAnswers.filter(ans => ans !== correctAnswer);
        shuffleArray(incorrectOptionsPool);
        const randomIncorrectOptions = incorrectOptionsPool.slice(0, 3);  
        const options = [correctAnswer, ...randomIncorrectOptions];
        const shuffledOptions = shuffleArray(options);

        
        return {
          ...question, 
          options: shuffledOptions, 
        };
      }); 

      
      state.status = 'active';
      state.userName = action.payload;
      state.questions = newQuestions; 
      state.currentQuestionIndex = 0;
      state.userAnswers = [];
      state.timer = 90; 
    },
    
    answerQuestion: (state, action) => {
      const { questionIndex, answer } = action.payload;
      const existingAnswer = state.userAnswers.find(a => a.questionIndex === questionIndex);
      if (existingAnswer) {
        existingAnswer.answer = answer;
      } else {
        state.userAnswers.push(action.payload);
      }
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    prevQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    setTimer: (state, action) => {
        state.timer = action.payload;
    },
    finishQuiz: (state) => {
        state.status = 'finished';
    },
    resetQuiz: () => initialState,
  },
});

export const { startQuiz, answerQuestion, nextQuestion, prevQuestion, setTimer, finishQuiz, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;