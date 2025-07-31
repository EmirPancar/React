import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: {
    bekliyor: [],
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
      const { columnId, title, assignee } = action.payload;
      if (state.tasks[columnId]) {
        const newTask = {
          id: `task-${Date.now()}`,
          title,
          assignee, 
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          history: []
        };
        state.tasks[columnId].push(newTask);
      }
    },

    updateTask(state, action) {
      const { taskId, newTitle, newAssignee } = action.payload;
      for (const columnId in state.tasks) {
        const taskIndex = state.tasks[columnId].findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          const task = state.tasks[columnId][taskIndex];
          
          const historyEntry = {
            timestamp: task.updatedAt,
            oldTitle: task.title,
            oldAssignee: task.assignee 
          };
          task.history.unshift(historyEntry); 

          task.title = newTitle;
          task.assignee = newAssignee; 
          task.updatedAt = new Date().toISOString();
          
          return; 
        }
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
        movedItem.updatedAt = new Date().toISOString();
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
            const remainingTasks = [];
            for (const task of state.tasks[columnId]) {
                if (state.selectedTaskIds.includes(task.id)) {
                    task.updatedAt = new Date().toISOString();
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
    },

    addTasksToSelection(state, action) {
        const taskIdsToAdd = action.payload; 
        taskIdsToAdd.forEach(taskId => {
            if (!state.selectedTaskIds.includes(taskId)) {
                state.selectedTaskIds.push(taskId);
            }
        });
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
    clearTaskSelection,
    addTasksToSelection,
    updateTask 
} = tasksSlice.actions;

export default tasksSlice.reducer;