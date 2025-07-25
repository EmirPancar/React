import { createSlice } from "@reduxjs/toolkit";

const loadTasks = () => {
  const saved = localStorage.getItem("tasks");
  return saved ? JSON.parse(saved) : [];
};

const saveTasks = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const initialState = {
  tasks: loadTasks(),
  selectedTaskId: null
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      saveTasks(state.tasks);
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      state.selectedTaskId = null;
      saveTasks(state.tasks);
    },
    updateTask: (state, action) => {
      const { id, updatedTask } = action.payload;
      const index = state.tasks.findIndex(task => task.id === id);
      if (index !== -1) {
        state.tasks[index] = updatedTask;
        saveTasks(state.tasks);
      }
    },
    setSelectedTaskId: (state, action) => {
      state.selectedTaskId = action.payload;
    },
    toggleImportant: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.important = !task.important;
        saveTasks(state.tasks);
      }
    },
    markAsCompleted: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = true;
        task.important = false;
        if (state.selectedTaskId === task.id) {
          state.selectedTaskId = null;
        }
        saveTasks(state.tasks);
      }
    },
    markAsUncompleted: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = false;
        saveTasks(state.tasks);
      }
    }
  }
});

export const {
  addTask,
  deleteTask,
  updateTask,
  setSelectedTaskId,
  toggleImportant,
  markAsCompleted,
  markAsUncompleted
} = taskSlice.actions;

export default taskSlice.reducer;
