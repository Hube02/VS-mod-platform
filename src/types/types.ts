export interface Mod {
    modid: number,
    assetid: number,
    downloads: number,
    name: string,
    summary: string,
    modidstrs: string[],
    author: string,
    side: string,
    type: string,
    logo: string,
    tags: Tag[],
    lastreleased: string
}

export interface Modpack {
    name: string;
    mods: Mod[];
}

export type Tag = string

export const MODPACKS_STORAGE_KEY = "modpacks";
export const MOD_STORAGE_KEY = "allMods";

export const PAGE_SIZE = 12;
