import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Pagination,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import {Mod, Modpack, PAGE_SIZE} from "../types/types";
import {loadModpacks, saveModpacks} from "../store/storage";
import {mockFetchMods} from "../store/api";

const MotionCard = motion(Card);

export default function ModList() {
    const [page, setPage] = useState(1);
    const [mods, setMods] = useState<Mod[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [modpacks, setModpacks] = useState<Modpack[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedMod, setSelectedMod] = useState<Mod | null>(null);
    const [newPackName, setNewPackName] = useState("");

    useEffect(() => {
        setModpacks(loadModpacks());
    }, []);

    useEffect(() => {
        mockFetchMods(page).then((res) => {
            setLoading(true);
            setMods(res.items);
            setTotal(200);
            setLoading(false);
        })
    }, [page]);

    const totalPages = Math.ceil(total / PAGE_SIZE);

    function addToPack(packName: string) {
        if (!selectedMod) return;

        const updated = [...modpacks];
        const idx = updated.findIndex((p) => p.name === packName);

        if (idx >= 0) {
            updated[idx].mods.push(selectedMod);
        } else {
            updated.push({ name: packName, mods: [selectedMod] });
        }

        setModpacks(updated);
        saveModpacks(updated);
        setDialogOpen(false);
        setNewPackName("");
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Mod Browser
            </Typography>

            <Grid container spacing={3}>
                {mods.map((mod) => (
                    <Grid sx={{xs: 12, sm: 6, md: 3}} key={mod.id}>
                        <MotionCard whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 260 }}>
                            <CardContent>
                                <Typography variant="h6">{mod.name}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    {mod.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    fullWidth
                                    onClick={() => {
                                        setSelectedMod(mod);
                                        setDialogOpen(true);
                                    }}
                                >
                                    Add to Modpack
                                </Button>
                            </CardActions>
                        </MotionCard>
                    </Grid>
                ))}
            </Grid>

            {loading && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading...
                </Typography>
            )}

            <Stack alignItems="center" sx={{ mt: 4 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                />
            </Stack>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
                <DialogTitle>Add to Modpack</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {modpacks.map((pack) => (
                            <Button
                                key={pack.name}
                                variant="outlined"
                                onClick={() => addToPack(pack.name)}
                            >
                                {pack.name} ({pack.mods.length} mods)
                            </Button>
                        ))}

                        <Box pt={2}>
                            <TextField
                                fullWidth
                                label="New modpack name"
                                value={newPackName}
                                onChange={(e) => setNewPackName(e.target.value)}
                            />
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button
                        disabled={!newPackName}
                        onClick={() => addToPack(newPackName)}
                    >
                        Create & Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
