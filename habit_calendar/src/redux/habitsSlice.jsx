import { createSlice } from '@reduxjs/toolkit';

// Başlangıç state'i. ID'lerin hepsini string yaparak veri tutarlılığı sağlandı.
const initialState = {
  habits: {
    '1': { id: '1', name: 'Spor Yap', color: '#4CAF50' },
    '2': { id: '2', name: 'Kitap Oku', color: '#2196F3' },
    '3': { id: '3', name: 'Meditasyon', color: '#FF9800' },
  },
  // Tamamlanan alışkanlıkları gün bazında saklıyoruz.
  // Örnek veri formatı: completed: { '2025-08-12': ['1', '3'] }
  completed: {},
};

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    /**
     * Bir tarihteki bir alışkanlığın tamamlanma durumunu değiştirir (toggle).
     * @param action.payload - { dateKey: 'yyyy-MM-dd' formatında string, habitId: string }
     */
    toggleHabitCompletion: (state, action) => {
      // Payload'dan verileri alıyoruz. Artık dateKey doğrudan string olarak geliyor.
      const { dateKey, habitId } = action.payload;

      const dayCompletions = state.completed[dateKey] || [];
      const habitIndex = dayCompletions.indexOf(habitId);

      // Redux Toolkit, Immer kütüphanesini kullandığı için state'i bu şekilde "değiştiriyormuş gibi" yazabiliriz.
      // Arka planda Immer, state'in kopyasını alarak immutable (değişmez) güncellemeyi kendi yapar.
      if (habitIndex > -1) {
        // Alışkanlık zaten tamamlanmış, listeden çıkar (filtrele).
        state.completed[dateKey] = dayCompletions.filter(id => id !== habitId);
      } else {
        // Alışkanlık tamamlanmamış, listeye ekle.
        state.completed[dateKey] = [...dayCompletions, habitId];
      }
    },
    // İleride yeni alışkanlık eklemek için bir reducer eklenebilir.
    addHabit: (state, action) => {
      const newHabit = action.payload;
      state.habits[newHabit.id] = newHabit;
    },
  },
});

// Eylemleri (actions) dışa aktar
export const { toggleHabitCompletion, addHabit } = habitsSlice.actions;

// Reducer'ı dışa aktar
export default habitsSlice.reducer;