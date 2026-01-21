import axios from "axios";
import {Mod, PAGE_SIZE} from "../types/types";

export function mockFetchMods(page: number): Promise<{ items: Mod[]; total: number }> {
    getAllMods();
    return new Promise((resolve) => {
        setTimeout(() => {
            const all: Mod[] = Array.from({ length: 42 }).map((_, i) => ({
                id: i + 1,
                name: `Modification #${i + 1}`,
                description: "High-quality gameplay modification with modern features.",
            }));

            const start = (page - 1) * PAGE_SIZE;
            resolve({
                items: all.slice(start, start + PAGE_SIZE),
                total: all.length,
            });
        }, 400);
    });
}

export function getAllMods() {
    return fetch("https://mods.vintagestory.at/api/mods").then(res => res.json()).then(data => {
        console.log(data);
        return data;
    }).catch (err => {
        console.error("Couldn't fetch mods!");
    })
}
