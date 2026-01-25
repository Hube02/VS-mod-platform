import {Paper, MenuItem, Select} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Modpack} from "../types/types";


export default function SelectCurrentModpack({currentModpack, setCurrentModpack, allModpacks}: {
    currentModpack?: Modpack,
    setCurrentModpack: (modpack: Modpack) => void,
    allModpacks: Modpack[],
}) {
    const [newModpack, setNewModpack] = useState('')

    useEffect(() => {
        currentModpack && setNewModpack(currentModpack.name)
    }, [currentModpack]);

    useEffect(() => {
        if (!allModpacks) return;
        const newCurrentModpack = allModpacks.filter(modpack => modpack.name == newModpack)
        setCurrentModpack(newCurrentModpack[0])
    }, [newModpack]);

    const handleChange = (event: any) => {
        setNewModpack(event.target.value as string)
    }

    return (
        <>
            <div style={{
                float: 'left',
                marginLeft: '16px',
                width: '15vw',
                textAlign: 'left',
                top: '15%',
                position: 'fixed',
            }}>
                <Paper
                    sx={{
                        display: 'block',
                        boxSizing: 'border-box',
                        p: 2
                    }}
                >
                    <Select value={newModpack}
                            onChange={handleChange}
                            label={'Current modpack'}
                            variant={'standard'}>
                        {allModpacks && allModpacks.map(modpack => {
                            return (
                                <MenuItem
                                    value={modpack.name}
                                >
                                    {`${modpack.name} (${modpack.mods.length} mods)`}
                                </MenuItem>)
                        })}
                    </Select>
                </Paper>
            </div>
        </>
    )
}