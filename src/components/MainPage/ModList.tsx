import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    CircularProgress,
    Pagination,
    Stack,
    Switch,
    Typography,
} from "@mui/material";
import {PAGE_SIZE} from "../../types/types";
import {checkAllModsAndFetch, loadModpacks} from "../../store/storage";
import {getAllMods, grabMods} from "../../store/api";
import ModGrid from "./ModGrid";
import ModSearch from "./ModSearch";
import {useAppDispatch, useAppSelector} from "../../utils/hooks";
import {addModpack, setCurrentModpack, setModpacks, setCurrentMods, setMods} from "../../store/reducer";
import {getCurrentModpack} from "../../store/selectors";


export default function ModList({handleOpen}: {handleOpen: (isAdding: boolean) => void}) {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [searchQuery, setSearchQuery] = useState<string>('')
    const [isDescriptionSearch, setIsDescriptionSearch] = useState<boolean>(false)

    const dispatch = useAppDispatch();
    const modpack = useAppSelector(getCurrentModpack)

    useEffect(() => {
        const loadedModpacks = loadModpacks();
        if (loadedModpacks.length > 0) {
            dispatch(setModpacks(loadedModpacks))
            dispatch(setCurrentModpack(loadedModpacks[0]))
        }
        if (checkAllModsAndFetch().length == 0) {
            handleRefresh()
        }
    }, []);

    useEffect(() => {
        modpack && dispatch(addModpack(modpack))
    }, [modpack]);

    useEffect(() => {
        if (page || searchQuery || isDescriptionSearch) {
            fetchMods(page, searchQuery.toLowerCase(), isDescriptionSearch)
        }
    }, [page, searchQuery, isDescriptionSearch]);

    function fetchMods(currentPage: number, searchPhrase: string, isDescription: boolean) {
        grabMods(currentPage, searchPhrase, isDescription).then((res) => {
            setLoading(true);
            dispatch(setCurrentMods(res.items));
            dispatch(setMods(res.allItems));
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
            <Box component='div'
                 sx={{px: '10%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Mod Browser
                </Typography>
                <Button onClick={handleRefresh}>Refresh mods</Button>
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
                    onChange={handleOpen}
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
        </>
    );
}
