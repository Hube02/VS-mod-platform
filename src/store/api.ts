import {Mod, PAGE_SIZE} from "../types/types";
import {checkAllModsAndFetch, saveAllMods} from "./storage";

export function grabMods(page: number, searchQuery: string, checkSummary: boolean = false): Promise<{ items: Mod[]; total: number }> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const all: Mod[] = checkAllModsAndFetch().filter(mod => {
                return checkSummary ? mod.summary.toLowerCase().match(searchQuery) : mod.name.toLowerCase().match(searchQuery)
            })

            const start = (page - 1) * PAGE_SIZE;
            resolve({
                items: all.slice(start, start + PAGE_SIZE),
                total: all.length,
            });
        }, 200);
    });
}

export async function getAllMods() {
    try {
        const res = await fetch("https://cors-anywhere.com/http://mods.vintagestory.at/api/mods");
        const data = await res.json();
        saveAllMods(data.mods);
    } catch (err) {
        console.error("Couldn't fetch mods!");
    }
}
