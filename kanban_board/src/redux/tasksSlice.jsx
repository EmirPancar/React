import { createSlice } from '@reduxjs/toolkit';

// Başlangıç durumundan x ve y koordinatları kaldırıldı.
const initialState = {
  bekliyor: [{ id: 'task-1', title: 'Yeni kullanıcı profili tasarımı' }, { id: 'task-2', title: 'Mobil uygulama için beyin fırtınası' }],
  yapiliyor: [{ id: 'task-3', title: 'API entegrasyonu dokümantasyonunu oku' }],
  test: [],
  geribildirim: [],
  tamamlandi: []
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // addTask artık pozisyon hesaplamıyor.
    addTask(state, action) {
      const { columnId, title } = action.payload;
      state[columnId].push({ id: `task-${Date.now()}`, title });
    },
    deleteTask(state, action) {
      const { columnId, taskId } = action.payload;
      state[columnId] = state[columnId].filter(task => task.id !== taskId);
    },
    // updateTaskPosition yerine eski, sıralama tabanlı moveTask geldi.
    moveTask(state, action) {
      const { sourceColumn, destColumn, sourceIndex, destIndex } = action.payload;
      
      // Görevi kaynak sütundan çıkar
      const [movedItem] = state[sourceColumn].splice(sourceIndex, 1);
      
      // Görevi hedef sütuna ekle
      state[destColumn].splice(destIndex, 0, movedItem);
    },
  },
});

// Action'ları doğru şekilde export ediyoruz.
export const { addTask, deleteTask, moveTask } = tasksSlice.actions;
export default tasksSlice.reducer;