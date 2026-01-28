import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    windowWidth: 1920,
}

const utilSlice = createSlice({
    name: 'utils',
    initialState,
    reducers: {
        setResizedValue(state, action) {
            state.windowWidth = action.payload
        },
    },
})

export const {
    setResizedValue,
} = utilSlice.actions

export default utilSlice.reducer
