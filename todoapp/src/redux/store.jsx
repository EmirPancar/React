import { configureStore } from '@reduxjs/toolkit'
import screen from './screenSlice'
import task from './taskSlice'

export const store = configureStore({
  reducer: {
    screen: screen,
    task:task
  },
})