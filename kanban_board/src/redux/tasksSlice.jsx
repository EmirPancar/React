import { createSlice } from '@reduxjs/toolkit';

// Başlangıç durumu. Artık seçili görevleri tutan bir dizi var.
const initialState = {
  tasks: {
    bekliyor: [{ id: 'task-1', title: 'Yeni kullanıcı profili tasarımı' }, { id: 'task-2', title: 'Mobil uygulama için beyin fırtınası' }],
    yapiliyor: [{ id: 'task-3', title: 'API entegrasyonu dokümantasyonunu oku' }],
    test: [],
    geribildirim: [],
    tamamlandi: []
  },
  selectedTaskIds: [], // Seçili olan görevlerin ID'lerini burada tutacağız.
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state, action) {
      const { columnId, title } = action.payload;
      state.tasks[columnId].push({ id: `task-${Date.now()}`, title });
    },
    deleteTask(state, action) {
      const { columnId, taskId } = action.payload;
      state.tasks[columnId] = state.tasks[columnId].filter(task => task.id !== taskId);
    },
    moveTask(state, action) {
      const { sourceColumn, destColumn, sourceIndex, destIndex } = action.payload;
      const [movedItem] = state.tasks[sourceColumn].splice(sourceIndex, 1);
      state.tasks[destColumn].splice(destIndex, 0, movedItem);
    },
    // YENİ ACTION: Bir görevin seçim durumunu değiştirir (seçer/seçimi kaldırır).
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
    // YENİ ACTION: Seçili olan tüm görevleri taşır.
    moveSelectedTasks(state, action) {
        const { destColumn } = action.payload;
        const tasksToMove = [];

        // Önce tüm taşınacak görevleri bul ve kaynak listelerden çıkar.
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

        // Şimdi taşınan görevleri hedef sütuna ekle.
        state.tasks[destColumn].push(...tasksToMove);
        // Taşıma sonrası seçimleri temizle.
        state.selectedTaskIds = [];
    },
    // YENİ ACTION: Tüm seçimleri temizler.
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
    clearTaskSelection
} = tasksSlice.actions;

export default tasksSlice.reducer;