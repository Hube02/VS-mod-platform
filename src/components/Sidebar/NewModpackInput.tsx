import {Button, Input, Typography} from "@mui/material";
import {ClipboardPaste} from "lucide-react";
import {importModpack} from "../../store/storage";
import React, {useState} from "react";
import {setCurrentModpack} from "../../store/reducer";
import {useAppDispatch} from "../../utils/hooks";

export default function NewModpackInput() {
    const [currentString, setCurrentString] = useState('')
    const [error, setError] = useState('')
    const dispatch = useAppDispatch()

    const handleImport = () => {
        try {
            JSON.parse(currentString)
            const modpack = importModpack(currentString)
            if (typeof modpack === 'string')
            {
                setError(modpack)
                return;
            }
            dispatch(setCurrentModpack(modpack))
            setCurrentString('')
        } catch {
            setError('String is not valid JSON')
            return;
        }
    }

    return (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Input
                sx={{width: '75%'}}
                value={currentString}
                onChange={(e) => setCurrentString(e.target.value)}
            />
            <Button onClick={handleImport}>
                <ClipboardPaste/>
            </Button>
            <Typography variant={'body2'}>{error}</Typography>
        </div>
    )
}