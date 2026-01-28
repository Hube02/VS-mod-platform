
import {Paper, Link, List, ListItem, Typography, Button, Tooltip} from "@mui/material";
import React from "react";
import Scrollbar from "react-scrollbars-custom";
import {ArrowLeft, RemoveCircleOutline, Input, FileDownloadDone, Download} from "@mui/icons-material";
import {motion} from "framer-motion";
import {useAppDispatch, useAppSelector, useWindowSize} from "../../utils/hooks";
import {getCurrentModpack, getMods} from "../../store/selectors";
import {removeModpack, setCurrentModpack, updateModWithDetails} from "../../store/reducer";
import {Mod} from "../../types/types";
import {fetchModDetailsByModId} from "../../store/api";
import {downloadZipFromModList} from "../../utils/dataShaper";

const MotionPaper = motion.create(Paper)
const MotionArrow = motion.create(ArrowLeft)

export default function CurrentModpack({isOpen, setIsOpen}: {
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void
}) {

    const currentModpack = useAppSelector(getCurrentModpack)
    const mods = useAppSelector(getMods)
    const dispatch = useAppDispatch()
    const {isMobile, isTablet} = useWindowSize()

    const handleRemoveMod = (mod: Mod) => {
        dispatch(setCurrentModpack({
            name: currentModpack?.name,
            mods: currentModpack?.mods.filter(currMod => mod.modid != currMod.modid)
        }))
    }

    const handleRemoveModpack = () => {
        dispatch(removeModpack(currentModpack))
        dispatch(setCurrentModpack(undefined))
    }

    const renderStatusIcons = (mod: Mod) => {
        if (!mods || !mod) return null;
        const modStatus = mods.find(allMod => allMod.modid === mod.modid)
        if (!modStatus) return null;
        return modStatus.lastreleased != mod.lastreleased ? (
            <Button style={{minWidth: '16px'}} onClick={() =>
                dispatch(setCurrentModpack({
                    name: currentModpack?.name,
                    mods: currentModpack?.mods.map(currMod => {
                        const updatedMod = JSON.parse(JSON.stringify(currMod));
                        if (modStatus.modid == currMod.modid) {
                            console.log(updatedMod)
                            updatedMod['lastreleased'] = modStatus.lastreleased
                        }
                        return updatedMod
                    })
                }))}>
                <Tooltip title={'Modpack has outdated version of the mod! Click to update it!'}>
                    <Input/>
                </Tooltip>
            </Button>
        ) : <Button style={{minWidth: '16px'}} disableRipple disableTouchRipple>
            <Tooltip title={'Modpack has the newest version of the mod!'}>
                <FileDownloadDone/>
            </Tooltip>
            </Button>
    }

    const handleDownload = async () => {
        if (!currentModpack) return;

        try {
            const modsToDownload: Mod[] = await Promise.all(
                currentModpack.mods.map(async (mod) => {
                    if (mod.releases) {
                        return mod;
                    }

                    const updatedMod = await fetchModDetailsByModId(mod);
                    if (!updatedMod) {
                        throw new Error(`Failed to fetch mod ${mod.name}`);
                    }

                    dispatch(updateModWithDetails(updatedMod));
                    return updatedMod;
                })
            );

            dispatch(
                setCurrentModpack({
                    name: currentModpack.name,
                    mods: modsToDownload,
                })
            );

            await downloadZipFromModList(modsToDownload, currentModpack.name);
        } catch (err) {
            console.error("Download failed:", err);
        }
    };

    return (
        <>
            <div style={isMobile ? {
                float: 'left',
                marginLeft: '16px',
                width: '30vw',
                textAlign: 'left',
                top: '25%',
                position: 'fixed',
            } : isTablet ? {
                float: 'left',
                marginLeft: '16px',
                width: '25vw',
                textAlign: 'left',
                top: '25%',
                position: 'fixed',
            } : {
                float: 'left',
                marginLeft: '16px',
                width: '15vw',
                textAlign: 'left',
                top: '25%',
                position: 'fixed',
            }}>
                <Button disableRipple style={{minWidth: '32px'}} sx={{display: 'block', width: '32px', height: '32px'}}
                        variant={'contained'} onClick={() => setIsOpen(!isOpen)}>
                    <MotionArrow animate={isOpen ? {
                        x: -12,
                        transition: {duration: 0.2}
                    } : {
                        x: -12,
                        rotate: 180,
                        transition: {duration: 0.2}
                    }}/>
                </Button>
                <MotionPaper
                    sx={{
                        display: 'block',
                        boxSizing: 'border-box',
                        p: 2
                    }}
                    animate={isOpen ? {
                        scaleX: 1,
                        opacity: 1,
                        x:0,
                        transition: {duration: 0.2}
                    } : {
                        scaleX: 0,
                        opacity: 0,
                        x:'-100%',
                        transition: {duration: 0.2}
                    }}
                >
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Typography variant={'h6'}>
                            {currentModpack?.name || 'No modpack created yet!'}
                        </Typography>
                        {currentModpack && (<>
                            <Button
                                onClick={handleDownload}
                                style={{minWidth:'16px'}}
                            >
                                <Download/>
                            </Button>
                            <Button
                                onClick={handleRemoveModpack}
                                style={{minWidth:'16px'}}
                            >
                                <RemoveCircleOutline/>
                            </Button>
                        </>)
                    }
                    </div>
                    <List sx={{width: '100%'}}>
                        <Scrollbar trackXProps={{style: {display: 'none'}}}
                                   style={{width: '100%', height: '33vh'}}>
                            {currentModpack?.mods.map(mod => {
                                return (
                                    <ListItem key={mod.modid + 'ListItem'}
                                        sx={{display: 'flex', justifyContent: 'space-between'}}
                                    >
                                        <div style={{display: 'block', width: '70%'}}>
                                            <Typography variant={'body2'} key={mod.modid + 'Name'}>
                                                <Tooltip title={mod.name}>
                                                    <Link
                                                        key={mod.modid + 'Link'}
                                                        target={'_blank'}
                                                        href={'https://mods.vintagestory.at/show/mod/' + mod.assetid}
                                                    >
                                                        {mod.name.length > 20 ? mod.name.slice(0, 20) + '...' : mod.name}
                                                    </Link>
                                                </Tooltip>
                                            </Typography>
                                        </div>
                                        {renderStatusIcons(mod)}
                                        <Button
                                            variant={'text'}
                                            style={{minWidth:'16px'}}
                                            onClick={() => handleRemoveMod(mod)}
                                        >
                                            -
                                        </Button>
                                    </ListItem>
                                )
                            })}
                        </Scrollbar>
                    </List>
                </MotionPaper>
            </div>
        </>
    )
}