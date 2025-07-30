import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: {
    bekliyor: [{ id: 'task-1', title: 'Yeni kullanıcı profili tasarımı' }, { id: 'task-2', title: 'Mobil uygulama için beyin fırtınası' }],
    yapiliyor: [{ id: 'task-3', title: 'API entegrasyonu dokümantasyonunu oku' }],
    test: [],
    geribildirim: [],
    tamamlandi: []
  },
  selectedTaskIds: [], 
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {

    addTask(state, action) {
      const { columnId, title } = action.payload;
      if (state.tasks[columnId]) {
        state.tasks[columnId].push({ id: `task-${Date.now()}`, title });
      }
    },

    deleteTask(state, action) {
      const { columnId, taskId } = action.payload;
      if (state.tasks[columnId]) {
        state.tasks[columnId] = state.tasks[columnId].filter(task => task.id !== taskId);
      }
    },

    moveTask(state, action) {
      const { sourceColumn, destColumn, sourceIndex, destIndex } = action.payload;
      if (state.tasks[sourceColumn] && state.tasks[destColumn]) {
        const [movedItem] = state.tasks[sourceColumn].splice(sourceIndex, 1);
        state.tasks[destColumn].splice(destIndex, 0, movedItem);
      }
    },

    toggleTaskSelection(state, action) {
        const taskId = action.payload;
        const index = state.selectedTaskIds.indexOf(taskId);
        if (index >= 0) {
   
            state.selectedTaskIds.splice(index, 1);
        } else {
           
            state.selectedTaskIds.push(taskId);
        }
    },

    moveSelectedTasks(state, action) {
        const { destColumn } = action.payload;
        if (state.selectedTaskIds.length === 0 || !state.tasks[destColumn]) return;

        const tasksToMove = [];

        for (const columnId in state.tasks) {
            const columnTasks = state.tasks[columnId];
            const remainingTasks = [];
            for (const task of columnTasks) {
                if (state.selectedTaskIds.includes(task.id)) {
                    tasksToMove.push(task);
                } else {
                    remainingTasks.push(task);
                }
            }
            state.tasks[columnId] = remainingTasks;
        }

        state.tasks[destColumn].push(...tasksToMove);

        state.selectedTaskIds = [];
    },

    deleteSelectedTasks(state) {
        if (state.selectedTaskIds.length === 0) return;

        for (const columnId in state.tasks) {
            state.tasks[columnId] = state.tasks[columnId].filter(
                task => !state.selectedTaskIds.includes(task.id)
            );
        }

        state.selectedTaskIds = [];
    },

    clearTaskSelection(state) {
        state.selectedTaskIds = [];
    }
  },
});


export const { 
    addTask, 
    deleteTask, 
    moveTask, 
    toggleTaskSelection,
    moveSelectedTasks,
    deleteSelectedTasks,
    clearTaskSelection
} = tasksSlice.actions;


export default tasksSlice.reducer;