export type Mod = {
    id: number;
    name: string;
    description: string;
};

export type Modpack = {
    name: string;
    mods: Mod[];
};

export const STORAGE_KEY = "modpacks";

export const PAGE_SIZE = 12;
