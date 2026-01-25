import {Paper, Link, List, ListItem, Typography, Button, Tooltip} from "@mui/material";
import React from "react";
import {Modpack} from "../types/types";
import Scrollbar from "react-scrollbars-custom";
import {ArrowLeft} from "@mui/icons-material";
import {motion} from "framer-motion";

const MotionPaper = motion.create(Paper)
const MotionArrow = motion.create(ArrowLeft)

export default function CurrentModpack({currentModpack, setCurrentModpack, isOpen, setIsOpen}: {
    currentModpack?: Modpack,
    setCurrentModpack: (modpack: Modpack) => void,
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void
}) {
    return (
        <>
            <div style={{
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
                    <Typography variant={'h6'}>
                        {currentModpack?.name || 'No modpack created yet!'}
                    </Typography>
                    <List sx={{width: '100%'}}>
                        <Scrollbar trackXProps={{style: {display: 'none'}}}
                                   style={{width: '100%', height: '33vh'}}>
                            {currentModpack?.mods.map(mod => {
                                return (<ListItem key={mod.modid + 'ListItem'}
                                                  sx={{display: 'flex', justifyContent: 'space-between'}}>
                                    <Typography variant={'body2'} key={mod.modid + 'Name'}>
                                        <Tooltip title={mod.name}>
                                            <Link key={mod.modid + 'Link'} target={'_blank'}
                                                  href={'https://mods.vintagestory.at/show/mod/' + mod.assetid}>
                                                {mod.name.length > 20 ? mod.name.slice(0, 20) + '...' : mod.name}
                                            </Link>
                                        </Tooltip>
                                    </Typography>
                                    <Button onClick={() => setCurrentModpack({
                                        name: currentModpack.name,
                                        mods: currentModpack.mods.filter(currMod => mod.modid != currMod.modid)
                                    })}>
                                        -
                                    </Button>
                                </ListItem>)
                            })}
                        </Scrollbar>
                    </List>
                </MotionPaper>
            </div>
        </>
    )
}