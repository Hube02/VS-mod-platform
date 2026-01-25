import {Mod, MOD_STORAGE_KEY, Modpack, MODPACKS_STORAGE_KEY} from "../types/types";


export function loadModpacks(): Modpack[] {
    return JSON.parse(localStorage.getItem(MODPACKS_STORAGE_KEY) || "[]");
}

export function saveModpacks(packs: Modpack[]) {
    localStorage.setItem(MODPACKS_STORAGE_KEY, JSON.stringify(packs));
}

export function saveAllMods(mods: Mod[]) {
    localStorage.setItem(MOD_STORAGE_KEY, JSON.stringify(mods))
}

export function checkAllModsAndFetch(): Mod[] | [] {
    return JSON.parse(localStorage.getItem(MOD_STORAGE_KEY) || '[]');
}
