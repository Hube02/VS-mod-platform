import {Modpack, STORAGE_KEY} from "../types/types";


export function loadModpacks(): Modpack[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function saveModpacks(packs: Modpack[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packs));
}
