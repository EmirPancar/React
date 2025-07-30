import { createSlice } from '@reduxjs/toolkit';

// Başlangıç durumu.
const initialState = {
  tasks: {
    bekliyor: [{ id: 'task-1', title: 'Yeni kullanıcı profili tasarımı' }, { id: 'task-2', title: 'Mobil uygulama için beyin fırtınası' }],
    yapiliyor: [{ id: 'task-3', title: 'API entegrasyonu dokümantasyonunu oku' }],
    test: [],
    geribildirim: [],
    tamamlandi: []
  },
  // Seçili olan görevlerin ID'lerini burada tutacağız.
  selectedTaskIds: [], 
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    /**
     * Belirtilen sütuna yeni bir görev ekler.
     */
    addTask(state, action) {
      const { columnId, title } = action.payload;
      if (state.tasks[columnId]) {
        state.tasks[columnId].push({ id: `task-${Date.now()}`, title });
      }
    },
    /**
     * Belirtilen sütundan tek bir görevi siler.
     */
    deleteTask(state, action) {
      const { columnId, taskId } = action.payload;
      if (state.tasks[columnId]) {
        state.tasks[columnId] = state.tasks[columnId].filter(task => task.id !== taskId);
      }
    },
    /**
     * Bir görevi bir konumdan diğerine taşır (aynı veya farklı sütunlar arasında).
     */
    moveTask(state, action) {
      const { sourceColumn, destColumn, sourceIndex, destIndex } = action.payload;
      if (state.tasks[sourceColumn] && state.tasks[destColumn]) {
        const [movedItem] = state.tasks[sourceColumn].splice(sourceIndex, 1);
        state.tasks[destColumn].splice(destIndex, 0, movedItem);
      }
    },
    /**
     * Bir görevin seçim durumunu değiştirir (seçer/seçimi kaldırır).
     */
    toggleTaskSelection(state, action) {
        const taskId = action.payload;
        const index = state.selectedTaskIds.indexOf(taskId);
        if (index >= 0) {
            // Zaten seçiliyse, seçimden çıkar.
            state.selectedTaskIds.splice(index, 1);
        } else {
            // Seçili değilse, seçime ekle.
            state.selectedTaskIds.push(taskId);
        }
    },
    /**
     * Seçili olan tüm görevleri hedef sütuna taşır.
     */
    moveSelectedTasks(state, action) {
        const { destColumn } = action.payload;
        if (state.selectedTaskIds.length === 0 || !state.tasks[destColumn]) return;

        const tasksToMove = [];
        for (const columnId in state.tasks) {
            const remainingTasks = [];
            for (const task of state.tasks[columnId]) {
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
    /**
     * Seçili olan tüm görevleri siler.
     */
    deleteSelectedTasks(state) {
        if (state.selectedTaskIds.length === 0) return;
        for (const columnId in state.tasks) {
            state.tasks[columnId] = state.tasks[columnId].filter(
                task => !state.selectedTaskIds.includes(task.id)
            );
        }
        state.selectedTaskIds = [];
    },
    /**
     * Tüm görev seçimlerini temizler.
     */
    clearTaskSelection(state) {
        state.selectedTaskIds = [];
    },
    /**
     * Verilen görev ID'lerini mevcut seçime ekler.
     * Zaten seçili olanları tekrar eklemez.
     */
    addTasksToSelection(state, action) {
        const taskIdsToAdd = action.payload; // Bu bir dizi olacak
        taskIdsToAdd.forEach(taskId => {
            if (!state.selectedTaskIds.includes(taskId)) {
                state.selectedTaskIds.push(taskId);
            }
        });
    }
  },
});

// Oluşturulan action creator'ları export et.
export const { 
    addTask, 
    deleteTask, 
    moveTask, 
    toggleTaskSelection,
    moveSelectedTasks,
    deleteSelectedTasks,
    clearTaskSelection,
    addTasksToSelection
} = tasksSlice.actions;

// Reducer'ı store'da kullanılmak üzere export et.
export default tasksSlice.reducer;