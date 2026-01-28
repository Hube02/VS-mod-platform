import type { RootState } from './store'

export const getCurrentMods = (state: RootState) => state.mod.currentMods
export const getMods = (state: RootState) => state.mod.allMods
export const getModpacks = (state: RootState) => state.mod.allModpacks
export const getCurrentModpack = (state: RootState) => state.mod.currentModpack
export const getSelectedMod = (state: RootState) => state.mod.selectedMod
export const getCurrentWindowSize = (state: RootState) => state.utils.windowWidth
