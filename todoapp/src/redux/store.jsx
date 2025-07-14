import { configureStore } from '@reduxjs/toolkit'
import screen from './screenSlice'

export const store = configureStore({
  reducer: {
    screen: screen
  },
})