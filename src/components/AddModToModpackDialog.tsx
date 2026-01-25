import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import {Mod, Modpack} from "../types/types";

interface ModToModpackDialogProps {
    isOpen: boolean
    onClose: () => void
    selectedMod: Mod|null
    isAdding: boolean
    allModpacks: Modpack[]
    setCurrentModpack: (modpacks: Modpack) => void
    currentModpack?: Modpack
}

export default function ModToModpackDialog({isOpen, onClose, selectedMod, isAdding, currentModpack, allModpacks, setCurrentModpack}: ModToModpackDialogProps) {
    const [newPackName, setNewPackName] = useState("");
    const [error, setError] = useState("");
    const modpack = currentModpack;

    useEffect(() => {
        setError('')
    }, [isOpen]);

    const handleChange = (modpackName: string) => {
        if (isAdding) {
            addToPack(modpackName)
        } else {
            removeFromPack()
        }
    }

    function addToPack(modpackName: string) {
        if (!selectedMod) return;
        if (modpackName == newPackName) {
            setCurrentModpack({name: modpackName, mods: [selectedMod]})
            onClose();
            return;
        }
        if (!modpack) {
            setError('No modpack name entered!')
            return;
        }
        setCurrentModpack(modpack)
        if (modpack.mods.find(mod => mod.modid == selectedMod.modid)) {
            setError("This mod is already added to selected modpack");
            return;
        }
        modpack.mods.push(selectedMod);

        onClose();
    }

    function removeFromPack() {
        if (!selectedMod) return;
        if (!modpack) return;
        setCurrentModpack({name: modpack.name, mods: modpack.mods.filter(mod => mod.modid != selectedMod.modid)})
        onClose();
    }

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth>
            <DialogTitle>{isAdding ? 'Add to modpack' : 'Remove from modpack'}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    {allModpacks.map((pack) => (
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
