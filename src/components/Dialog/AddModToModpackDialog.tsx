import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import {useAppDispatch, useAppSelector} from "../../utils/hooks";
import {getModpacks, getSelectedMod} from "../../store/selectors";
import {setCurrentModpack} from "../../store/reducer";
import {Modpack} from "../../types/types";

interface ModToModpackDialogProps {
    isOpen: boolean
    onClose: () => void
    isAdding: boolean
}

export default function ModToModpackDialog({isOpen, onClose, isAdding}: ModToModpackDialogProps) {
    const [newPackName, setNewPackName] = useState("");
    const [error, setError] = useState("");

    const dispatch = useAppDispatch()

    const allModpacks = useAppSelector(getModpacks)
    const selectedMod = useAppSelector(getSelectedMod)

    useEffect(() => {
        setError('')
        setNewPackName('')
    }, [isOpen]);

    const handleChange = (modpackName: string) => {
        if (!selectedMod) return;
        if (!allModpacks) return;
        const pack = allModpacks.find(pack => pack.name == modpackName)
        if (isAdding) {
            if (modpackName == newPackName) {
                dispatch(setCurrentModpack({name: modpackName, mods: [selectedMod]}))
                onClose();
                return;
            }
            addToPack(pack)
        } else {
            removeFromPack(pack)
        }
    }

    function addToPack(pack?: Modpack) {
        if (!pack) {
            setError('No modpack entered!')
            return;
        }
        if (pack?.mods.find(mod => mod.modid == selectedMod?.modid)) {
            setError("This mod is already added to selected modpack");
            return;
        }
        const modpack = {name: pack?.name, mods: [...pack?.mods!, selectedMod]}
        dispatch(setCurrentModpack(modpack))
        onClose();
    }

    function removeFromPack(pack?: Modpack) {
        if (!pack) {
            setError('No modpack entered!')
            return;
        }
        dispatch(setCurrentModpack({name: pack?.name, mods: pack?.mods.filter(mod => mod.modid != selectedMod?.modid)}))
        onClose();
    }

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth>
            <DialogTitle>{isAdding ? 'Add to modpack' : 'Remove from modpack'}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    {allModpacks && allModpacks.map((pack) => (
                        <Button
                            key={pack.name}
                            variant="outlined"
                            onClick={() => handleChange(pack.name)}
                        >
                            {pack.name} ({pack.mods.length} mods)
                        </Button>
                    ))}

                    {isAdding ? <Box pt={2}>
                        <TextField
                            fullWidth
                            label="New modpack name"
                            value={newPackName}
                            onChange={(e) => setNewPackName(e.target.value)}
                        />
                    </Box> : null}
                    {error}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    disabled={!newPackName}
                    onClick={() => handleChange(newPackName)}
                >
                    Create & Add
                </Button>
            </DialogActions>
        </Dialog>
    )
}
