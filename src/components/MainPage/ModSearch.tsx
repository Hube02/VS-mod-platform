import React, {useEffect, useMemo} from "react";
import {
    Box,
    TextField
} from "@mui/material";
import debounce from "lodash/debounce";



export default function ModSearch({onChange, children}:{onChange: (event: any) => void, children: React.ReactNode}) {
    const debouncedResults = useMemo(() => {
        return debounce(onChange, 200);
    }, [onChange]);

    useEffect(() => {
        return () => {
            debouncedResults.cancel();
        };
    });

    return (
        <Box component='div' sx={{p:1, display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
            <TextField
                sx={{m:2, minWidth: '40%'}}
                label="Search for a mod"
                onChange={debouncedResults}
            />
            <div style={{display: 'flex', alignItems: 'center'}}>
                {children}
            </div>
        </Box>

    )
}
