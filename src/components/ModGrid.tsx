import {Button, CardActions, CardContent, Card, Grid, Typography, Tooltip} from "@mui/material";
import {motion} from "framer-motion";
import {Mod} from "../types/types";
import Scrollbar from "react-scrollbars-custom";
import {useMobileSize, useTabletSize} from "../utils/useWindowSize";


const MotionCard = motion.create(Card);

export default function ModGrid({data, onChange}: { data: Mod[], onChange: (mod: Mod, isAdding: boolean) => void }) {
    const isMobile = useMobileSize()
    const isTablet = useTabletSize()
    return (
        <Grid container columns={3} spacing={2}>
            {data.map((mod) => (
                <Grid sx={isMobile ? {width: '100%'} : isTablet ? {width: '45%'} : {width: '30%'}} key={mod.modid}>
                    <MotionCard sx={{display: 'flex', height: '15vh'}} whileHover={{scale: 1.03}}
                                transition={{type: "spring", stiffness: 260}}>
                        <CardContent sx={{width: '100%'}}>
                            <Tooltip title={mod.name}>
                                <Typography variant="body1">
                                        {mod.name.length > 24 ? mod.name.slice(0, 24)+'...' : mod.name}
                                </Typography>
                            </Tooltip>
                            <div style={{width: '100%', height: '100%', overflow: 'none'}}>
                                <Scrollbar trackXProps={{style: {display: 'none'}}} style={{width: '100%', height: '75%'}}>
                                    <Typography variant="body2" color="text.secondary" overflow={'none'}>
                                        {mod.summary}
                                    </Typography>
                                </Scrollbar>
                            </div>
                        </CardContent>
                        <CardActions sx={{
                            width: '15%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-around'
                        }}>
                            <Button
                                size="small"
                                onClick={() => onChange(mod, true)}
                            >
                                +
                            </Button>
                            <Button
                                style={{margin: 0}}
                                size="small"
                                onClick={() => onChange(mod, false)}
                            >
                                -
                            </Button>
                        </CardActions>
                    </MotionCard>
                </Grid>
            ))}
        </Grid>
    )
}
