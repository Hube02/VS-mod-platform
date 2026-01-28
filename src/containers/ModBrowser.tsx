import React, {useState} from "react";
import SelectCurrentModpack from "../components/Sidebar/SelectCurrentModpack";
import CurrentModpack from "../components/Sidebar/CurrentModpack";
import { Container } from "@mui/material";
import ModToModpackDialog from "../components/Dialog/AddModToModpackDialog";
import ModList from "../components/MainPage/ModList";
import {useWindowSize} from "../utils/hooks";

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
            <SelectCurrentModpack/>
            <CurrentModpack
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />
            <Container sx={isMobile ? {width: '60%', maxWidth: '60%', py: 4, marginRight: 0} : isTablet ? {width: '70%', maxWidth: '70%', py: 4, marginRight: 0} : {width: '80%', maxWidth: '80%', py: 4, mx: '20%'}}>
                <ModList handleOpen={(isAdding: boolean) => handleModAction(isAdding)}/>
            </Container>
            <ModToModpackDialog isOpen={dialogOpen}
                                isAdding={isAdding}
                                onClose={() => setDialogOpen(false)}
            />
        </>

    )
}