import {Mod, PAGE_SIZE} from "../types/types";
import {checkAllModsAndFetch, saveAllMods} from "./storage";

export function grabMods(page: number, searchQuery: string, checkSummary: boolean = false): Promise<{ items: Mod[]; total: number, allItems: Mod[] }> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const actualAll = checkAllModsAndFetch()
            console.log(actualAll)
            const all: Mod[] = actualAll.filter(mod => {
                return checkSummary ? mod.summary.toLowerCase().match(searchQuery) : mod.name.toLowerCase().match(searchQuery)
            })

            const start = (page - 1) * PAGE_SIZE;
            resolve({
                items: all.slice(start, start + PAGE_SIZE),
                total: all.length,
                allItems: actualAll
            });
        }, 200);
    });
}

export async function getAllMods() {
    try {
        const res = await fetch("https://vs-mod-browser.jakubadamski8.workers.dev/?url=http://mods.vintagestory.at/api/mods");
        const data = await res.json();
        saveAllMods(data.mods);
    } catch (err) {
        console.error("Couldn't fetch mods!");
    }
}

function verifyResponse(isOk: boolean, message: string) {
    if (!isOk) throw Error(message)
}

export async function fetchModDetailsByModId(mod: Mod): Promise<Mod | null> {
    try {
        const res = await fetch(
            `https://vs-mod-browser.jakubadamski8.workers.dev/?url=http://mods.vintagestory.at/api/mod/${mod.modid}`
        );

        verifyResponse(res.ok, `HTTP ${res.status}`);

        const data = await res.json();

        return {
            ...mod,
            releases: data.mod.releases,
        };
    } catch (err: any) {
        console.error(`Couldn't fetch mod ${mod.modid}:`, err.message);
        return null;
    }
}
