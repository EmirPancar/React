import { createSlice } from '@reduxjs/toolkit';
import questions from '../questions.json'; 

const initialState = {
  questions,
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
      state.status = 'active';
      state.userName = action.payload;
      state.currentQuestionIndex = 0;
      state.userAnswers = [];
      state.timer = 60;
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