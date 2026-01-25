import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Pagination,
    Stack,
    Switch,
    Typography,
} from "@mui/material";
import {Mod, Modpack, PAGE_SIZE} from "../types/types";
import {checkAllModsAndFetch, loadModpacks, saveModpacks} from "../store/storage";
import {getAllMods, grabMods} from "../store/api";
import ModToModpackDialog from "../components/AddModToModpackDialog";
import ModGrid from "../components/ModGrid";
import ModSearch from "../components/ModSearch";
import CurrentModpack from "../components/CurrentModpack";
import SelectCurrentModpack from "../components/SelectCurrentModpack";


export default function ModList() {
    const [page, setPage] = useState(1);
    const [mods, setMods] = useState<Mod[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [isAdding, setIsAdding] = useState<boolean>(false)
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedMod, setSelectedMod] = useState<Mod | null>(null);

    const [searchQuery, setSearchQuery] = useState<string>('')
    const [isDescriptionSearch, setIsDescriptionSearch] = useState<boolean>(false)

    const [modpacks, setModpacks] = useState<Modpack[]>([]);
    const [currentModpack, setCurrentModpack] = useState<Modpack | undefined>();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    useEffect(() => {
        const loadedModpacks = loadModpacks();
        console.log(loadedModpacks)
        if (loadedModpacks.length > 0) {
            setModpacks(loadedModpacks);
            setCurrentModpack(loadedModpacks[0])
        }
        if (checkAllModsAndFetch().length == 0) {
            handleRefresh()
        }
    }, []);
    useEffect(() => {
        if (modpacks.length > 0) {
            saveModpacks(modpacks)
        }
    }, [modpacks]);

    const handleModpackSave = (modpack: Modpack) => {
        setModpacks(prevState => {
            return [...prevState.filter(pack => pack.name != modpack.name), modpack]
        })
        setCurrentModpack(modpack)
    }

    useEffect(() => {
        fetchMods(page, searchQuery, isDescriptionSearch)
    }, [page, searchQuery, isDescriptionSearch]);

    function fetchMods(currentPage: number, searchPhrase: string, isDesciption: boolean) {
        grabMods(currentPage, searchPhrase, isDesciption).then((res) => {
            setLoading(true);
            setMods(res.items);
            setTotal(res.total);
            setLoading(false);
        })
    }

    const handleRefresh = () => {
        setLoading(true)
        getAllMods().then(_ => {
            fetchMods(page, searchQuery, isDescriptionSearch)
            setLoading(false)
        })
    }

    function handleSearch(event: any) {
        setSearchQuery(event.target.value)
        setPage(1)
    }

    return (
        <>
            <SelectCurrentModpack
                currentModpack={currentModpack}
                setCurrentModpack={setCurrentModpack}
                allModpacks={modpacks && modpacks}/>
            <CurrentModpack
                currentModpack={currentModpack}
                setCurrentModpack={handleModpackSave}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}/>
            <Container sx={{width: '80%', maxWidth: '80%', py: 4, mx: '20%'}}>
                <Box component='div'
                     sx={{px: '10%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Mod Browser
                    </Typography>
                    <Button onClick={() => handleRefresh()}>Refresh mods</Button>
                </Box>
                <ModSearch onChange={handleSearch}>
                    <Typography variant={'body2'}>
                        Name search
                    </Typography>
                    <Switch checked={isDescriptionSearch}
                            onClick={(event: any) => setIsDescriptionSearch(event.target.checked)}/>
                    <Typography variant={'body2'}>
                        Description search
                    </Typography>
                </ModSearch>
                {loading ?
                    <CircularProgress/> :
                    <ModGrid
                        data={mods}
                        onChange={(mod: Mod, isAdding: boolean) => {
                            setSelectedMod(mod)
                            setIsAdding(isAdding)
                            setDialogOpen(true)
                        }}
                    />
                }

                {loading && (
                    <Typography variant="body2" sx={{mt: 2}}>
                        Loading...
                    </Typography>
                )}

                <Stack alignItems="center" sx={{mt: 4}}>
                    <Pagination
                        count={Math.ceil(total / PAGE_SIZE)}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        color="primary"
                    />
                </Stack>
            </Container>
            <ModToModpackDialog isOpen={dialogOpen}
                                isAdding={isAdding}
                                selectedMod={selectedMod}
                                onClose={() => setDialogOpen(false)}
                                allModpacks={modpacks}
                                setCurrentModpack={handleModpackSave}
                                currentModpack={currentModpack}
            />
        </>
    );
}
