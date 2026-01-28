import {Mod, Modpack, ModpackDTO} from "../types/types";
import {checkAllModsAndFetch} from "../store/storage";
import JSZip from "jszip";

export function createModpackDTO({name, mods}: Modpack): ModpackDTO {
    const dto: ModpackDTO = {}
    dto[name.toString()] = [...mods.map(mod => ({'modid': mod.modid, 'lastreleased': mod.lastreleased}))]
    return dto;
}

export function createModpackFromDTO(modpackCode: ModpackDTO): Modpack {
    const allMods = checkAllModsAndFetch()
    const modpackName = Object.keys(modpackCode)[0];
    console.log(modpackCode, modpackCode[modpackName])
    return {
        name: modpackName, mods: [...modpackCode[modpackName].map(dtoMod => {
            const finalMod = allMods.find(mod => {
                return mod.modid == dtoMod.modid
            })
            finalMod!.lastreleased = dtoMod.lastreleased
            return finalMod!
        })]
    }
}

export const downloadZipFromModList = async (modList: Mod[], modpackName: string) => {
    const {urlList, nameList} = modList.reduce(
        (acc, mod) => {
            acc.urlList.push("https://vs-mod-browser.jakubadamski8.workers.dev/?url=" + mod.releases[0].mainfile);
            acc.nameList.push(mod.releases[0].filename);
            return acc;
        }, {urlList: <string[]>[], nameList: <string[]>[]}
    );

    const zip = new JSZip();
    for (let i = 0; i < urlList.length; i++) {
        const response = await fetch(urlList[i]);
        const blob = await response.blob();
        zip.file(nameList[i], blob);
    }
    const finalZipBlob = await zip.generateAsync({type: "blob"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(finalZipBlob);
    a.download = modpackName + ".zip";
    a.click();
    URL.revokeObjectURL(a.href);
}

