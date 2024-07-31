
import { configureStore } from '@reduxjs/toolkit'
import exampleReducer, { ExampleState } from './slices/exampleSlice'

export const store = configureStore({
  reducer: {
    example: exampleReducer,
  },
})

export type RootState = {
  example: ExampleState; 
}

export type AppDispatch = typeof store.dispatch
