import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase';
import { collection, getDocs, addDoc, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';

export const fetchScores = createAsyncThunk('leaderboard/fetchScores', async () => {
    const scoresCollection = collection(db, 'scores');
    const q = query(scoresCollection, orderBy('wpm', 'desc'), orderBy('accuracy', 'desc'), limit(100));
    const querySnapshot = await getDocs(q);
    const scores = [];
    querySnapshot.forEach((doc) => {
        scores.push({ id: doc.id, ...doc.data() });
    });
    return scores;
});

export const saveScore = createAsyncThunk('leaderboard/saveScore', async (scoreData) => {
    const scoresCollection = collection(db, 'scores');
    const docRef = await addDoc(scoresCollection, {
        ...scoreData,
        createdAt: serverTimestamp(), 
    });
    return { id: docRef.id, ...scoreData };
});

const initialState = {
  isMenuOpen: false,
  scores: [], 
  status: 'idle', 
  error: null,
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    toggleLeaderboard: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchScores.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchScores.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.scores = action.payload; 
      })
      .addCase(fetchScores.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(saveScore.pending, (state) => {
      })
      .addCase(saveScore.fulfilled, (state, action) => {
        state.scores.push(action.payload);
        state.scores.sort((a, b) => {
          if (a.wpm !== b.wpm) return b.wpm - a.wpm;
          return b.accuracy - a.accuracy;
        });
      });
  },
});

export const { toggleLeaderboard } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;