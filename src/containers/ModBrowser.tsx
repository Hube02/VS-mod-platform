import React, {useState} from "react";
import SelectCurrentModpack from "../components/Sidebar/SelectCurrentModpack";
import CurrentModpack from "../components/Sidebar/CurrentModpack";
import {Button, Container, Dialog } from "@mui/material";
import ModToModpackDialog from "../components/Dialog/AddModToModpackDialog";
import ModList from "../components/MainPage/ModList";
import {useWindowSize} from "../utils/hooks";
import { motion } from "framer-motion";
import { ArrowLeft } from "@mui/icons-material";

const MotionArrow = motion.create(ArrowLeft)

export default function ModBrowser() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isAdding, setIsAdding] = useState<boolean>(false)
    const [dialogOpen, setDialogOpen] = useState(false);
    const {isMobile, isTablet} = useWindowSize()

    const handleModAction = (isAdding: boolean) => {
        setIsAdding(isAdding)
        setDialogOpen(isAdding)
    }

    return (
        <>
            <Button disableRipple style={{minWidth: '32px'}} sx={{m: 2, float: 'left', display: 'block', width: '32px', height: '32px'}}
                    variant={'contained'} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <MotionArrow animate={isSidebarOpen ? {
                    x: -12,
                    transition: {duration: 0.2}
                } : {
                    x: -12,
                    rotate: 180,
                    transition: {duration: 0.2}
                }}/>
            </Button>
            {isMobile ? (<Dialog sx={{width: '75vw', m: 'auto'}} slotProps={{paper: {sx: {p:2}}}} open={!isSidebarOpen} onClose={() => setIsSidebarOpen(!isSidebarOpen)}>
                <div style={{translate: '-16px', width: '100%', height: 'auto'}}>
                    <SelectCurrentModpack
                        isOpen={isSidebarOpen}
                    />
                    <CurrentModpack
                        isOpen={isSidebarOpen}
                    />
                </div>
            </Dialog>) : (
                <div style={isTablet ? {width: '30vw', height: 'auto'} : {width: '20vw',height: 'auto'}}>
                    <SelectCurrentModpack
                        isOpen={isSidebarOpen}
                    />
                    <CurrentModpack
                        isOpen={isSidebarOpen}
                    />
                </div>)
            }
            <Container sx={isMobile ? {width: '100%', maxWidth: '100%', py: 2, marginRight: 0} : isTablet ? {width: '70%', maxWidth: '70%', py: 3, marginRight: 0} : {width: '80%', maxWidth: '80%', py: 4, mx: '20%'}}>
                <ModList handleOpen={(isAdding: boolean) => handleModAction(isAdding)}/>
            </Container>
            <ModToModpackDialog isOpen={dialogOpen}
                                isAdding={isAdding}
                                onClose={() => setDialogOpen(false)}
            />
        </>

    )
}