import { configureStore } from '@reduxjs/toolkit'
import modReducer from './reducer'
import utilReducer from "./utilReducer";

export const store = configureStore({
    reducer: {
        mod: modReducer,
        utils: utilReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch