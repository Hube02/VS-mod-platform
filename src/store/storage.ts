import {Mod, MOD_STORAGE_KEY, Modpack, ModpackDTO, MODPACKS_STORAGE_KEY} from "../types/types";
import {createModpackDTO, createModpackFromDTO} from "../utils/dataShaper";


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

export function exportModpack(modpack: Modpack): string {
    const dto = createModpackDTO(modpack);
    const stringifiedModpack = JSON.stringify(dto);
    navigator.clipboard.writeText(stringifiedModpack).then(_ => {
        return stringifiedModpack
    }).catch(_ => {
        console.log('There was an issue copying modpack code to clipboard!')
    })
    return '';
}

export function importModpack(modpackCode: string): Modpack|string {
    const allModpacks = loadModpacks()
    const dto: ModpackDTO = JSON.parse(modpackCode)
    const modpack: Modpack = createModpackFromDTO(dto)
    if (allModpacks.filter(pack => pack.name == modpack.name)?.length !== 0) {
        console.error('You already have modpack with that name!')
        return 'You already have modpack with that name!';
    }
    return modpack
}

