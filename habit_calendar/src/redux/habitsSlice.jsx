import { createSlice } from '@reduxjs/toolkit';

const PRESET_COLORS_FOR_RANDOM = [
    '#77dd77', '#fdfd96', '#84b6f4', '#fdcae1', '#ff6961',
    '#a7c7e7', '#facc15', '#b2f7ef', '#e6e6fa', '#ffb347',
    '#ffc09f', '#cbf3f0', '#e1b382', '#d4a5a5', '#a8d8ea'
];

const initialState = {
  habitsByDate: {}, 
  colorsByDate: {}, 
};

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    addHabit: (state, action) => {
      const { date, habit } = action.payload;

      const isFirstHabit = !state.habitsByDate[date] || state.habitsByDate[date].length === 0;
      if (!state.colorsByDate[date] && isFirstHabit) {
          const randomIndex = Math.floor(Math.random() * PRESET_COLORS_FOR_RANDOM.length);
          state.colorsByDate[date] = PRESET_COLORS_FOR_RANDOM[randomIndex];
      }

      if (!state.habitsByDate[date]) {
        state.habitsByDate[date] = [];
      }
      state.habitsByDate[date].push({ ...habit, id: Date.now(), completed: false });
    },
    editHabit: (state, action) => {
      const { date, habitId, updatedTitle, updatedContent } = action.payload;
      const habitsForDay = state.habitsByDate[date];
      const habitToEdit = habitsForDay?.find(h => h.id === habitId);

      if (habitToEdit) {
        habitToEdit.title = updatedTitle;
        habitToEdit.content = updatedContent;
      }
    },
    toggleHabit: (state, action) => {
      const { date, habitId } = action.payload;
      const habitsForDay = state.habitsByDate[date];
      const habit = habitsForDay?.find(h => h.id === habitId);

      if (habit) {
        habit.completed = !habit.completed;
        const allCompleted = habitsForDay.length > 0 && habitsForDay.every(h => h.completed);
        if (allCompleted) {
          delete state.colorsByDate[date];
        }
      }
    },
    deleteHabit: (state, action) => {
      const { date, habitId } = action.payload;
      const habitsForDay = state.habitsByDate[date];
      if (habitsForDay) {
        state.habitsByDate[date] = habitsForDay.filter((h) => h.id !== habitId);
        if (state.habitsByDate[date].length === 0) {
          delete state.colorsByDate[date];
        }
      }
    },
    setDayColor: (state, action) => {
      const { date, color } = action.payload;
      if (color) {
        state.colorsByDate[date] = color;
      } else {
        delete state.colorsByDate[date];
      }
    },
  },
});

export const { addHabit, editHabit, toggleHabit, deleteHabit, setDayColor } = habitsSlice.actions;

export const selectHabitsForDate = (state, date) => state.habits.habitsByDate[date] || [];
export const selectColorForDate = (state, date) => state.habits.colorsByDate[date];

export default habitsSlice.reducer;