import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentScreen: 'tasks'
}

export const screenSlice = createSlice({
    name: 'screens',
    initialState,
    reducers:{

        setScreen: (state, action) => {
        state.currentScreen = action.payload;     
        }
    }
})

export const { setScreen } = screenSlice.actions
export default screenSlice.reducer 