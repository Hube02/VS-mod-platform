import { Button } from "@mui/material";
import { usePWAInstall } from "../../utils/hooks";

function InstallButton() {
    const { isInstallable, promptInstall } = usePWAInstall();

    if (!isInstallable) return null;

    return (
        <Button onClick={promptInstall}>
            Install App
        </Button>
    );
}

export default InstallButton;
