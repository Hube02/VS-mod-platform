import {Paper, MenuItem, Select, Button} from "@mui/material";
import React, {useEffect, useState} from "react";
import {exportModpack} from "../../store/storage";
import {ClipboardCopy} from "lucide-react";
import NewModpackInput from "./NewModpackInput";
import {useAppDispatch, useAppSelector} from "../../utils/hooks";
import {getCurrentModpack, getModpacks} from "../../store/selectors";
import {setCurrentModpack} from "../../store/reducer";


export default function SelectCurrentModpack() {
    const [newModpack, setNewModpack] = useState('')

    const currentModpack = useAppSelector(getCurrentModpack)
    const allModpacks = useAppSelector(getModpacks)
    const dispatch = useAppDispatch()

    useEffect(() => {
        currentModpack && setNewModpack(currentModpack.name)
    }, [currentModpack]);

    useEffect(() => {
        if (!allModpacks) return;
        const newCurrentModpack = allModpacks.filter(modpack => modpack?.name == newModpack)
        dispatch(setCurrentModpack(newCurrentModpack[0]))
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
                top: '10%',
                position: 'fixed',
            }}>
                <Paper
                    sx={{
                        display: 'block',
                        boxSizing: 'border-box',
                        p: 2
                    }}
                >
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Select
                            sx={{width: '75%'}}
                            value={newModpack}
                            onChange={handleChange}
                            label={'Current modpack'}
                            variant={'standard'}
                        >
                            {allModpacks.length > 0 && allModpacks.map(modpack => {
                                return (
                                    <MenuItem
                                        value={modpack?.name}
                                    >
                                        {`${modpack?.name} (${modpack?.mods.length} mods)`}
                                    </MenuItem>)
                            })}
                        </Select>
                        {currentModpack && <Button onClick={() => exportModpack(currentModpack)}>
                            <ClipboardCopy/>
                        </Button>}
                    </div>
                    <NewModpackInput/>
                </Paper>
            </div>
        </>
    )
}