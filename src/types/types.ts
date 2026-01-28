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
    lastreleased: string,
    releases: Release[]

}
export interface Release {
    fileid: number
    mainfile: string
    filename: string
    tags: string[]
}

export interface Modpack {
    name: string;
    mods: Mod[];
}

export interface ModpackDTO {
    [key: string]: Pick<Mod, 'modid'|'lastreleased'>[]
}

export type Tag = string

export const MODPACKS_STORAGE_KEY = "modpacks";
export const MOD_STORAGE_KEY = "allMods";

export const PAGE_SIZE = 12;
