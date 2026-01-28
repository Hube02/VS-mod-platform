import {Button, CardActions, CardContent, Card, Grid, Typography, Tooltip} from "@mui/material";
import {motion} from "framer-motion";
import {Mod} from "../../types/types";
import Scrollbar from "react-scrollbars-custom";
import {useAppDispatch, useAppSelector, useWindowSize} from "../../utils/hooks";
import {getCurrentMods} from "../../store/selectors";
import {setSelectedMod} from "../../store/reducer";


const MotionCard = motion.create(Card);

export default function ModGrid({onChange}: { onChange: (isAdding: boolean) => void}) {
    const data = useAppSelector(getCurrentMods)
    const dispatch = useAppDispatch()
    const {isMobile, isTablet} = useWindowSize()

    const handleChange = (mod: Mod, isAdding: boolean) => {
        dispatch(setSelectedMod(mod))
        onChange(isAdding)
    }

    return (
        <Grid container columns={isMobile ? 1 : isTablet ? 2 : 3} spacing={isMobile || isTablet ? 1 : 2}>
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
                                onClick={() => handleChange(mod, true)}
                            >
                                +
                            </Button>
                            <Button
                                style={{margin: 0}}
                                size="small"
                                onClick={() => handleChange(mod, false)}
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
