import { createSlice } from '@reduxjs/toolkit'
import {Mod, Modpack} from "../types/types";
import {saveAllMods, saveModpacks} from "./storage";

export interface stateType {
    allMods: Mod[],
    currentMods: Mod[],
    allModpacks: Modpack[],
    currentModpack?: Modpack,
    selectedMod?: Mod,
}
const initialState: stateType = {
    allMods: [],
    currentMods: [],
    allModpacks: [],
}

const modSlice = createSlice({
    name: 'mod',
    initialState,
    reducers: {
        updateModWithDetails(state, action) {
            state.allMods = [...state.allMods.filter(mod => mod.modid != action.payload.modid), action.payload]
            saveAllMods([...state.allMods.filter(mod => mod.modid != action.payload.modid), action.payload])
        },
        setMods(state, action) {
            state.allMods = action.payload
            saveAllMods(action.payload)
        },
        setCurrentMods(state, action) {
            state.currentMods = action.payload
        },
        setSelectedMod(state, action) {
            state.selectedMod = action.payload
        },
        setModpacks(state, action) {
            state.allModpacks = action.payload
            saveModpacks(action.payload)
        },
        addModpack(state, action) {
            state.allModpacks = [...state.allModpacks.filter(pack => pack?.name != action.payload?.name), action.payload]
            saveModpacks([...state.allModpacks.filter(pack => pack?.name != action.payload?.name), action.payload])
        },
        removeModpack(state, action) {
            state.allModpacks = [...state.allModpacks.filter(pack => pack?.name != action.payload?.name)]
            saveModpacks([...state.allModpacks.filter(pack => pack?.name != action.payload?.name)])
        },
        setCurrentModpack(state, action) {
            state.currentModpack = action.payload
        },
    },
})

export const {
    setCurrentMods,
    setMods,
    updateModWithDetails,
    setSelectedMod,
    setModpacks,
    addModpack,
    removeModpack,
    setCurrentModpack,
} = modSlice.actions

export default modSlice.reducer
