import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import {useState, useEffect} from 'react';
import {AppDispatch, RootState} from "../store/store";
import {setResizedValue} from "../store/utilReducer";

function getWindowSize() {
    const {innerWidth: width, innerHeight: height} = window;
    return {
        width,
        height
    };
}

export function useWindowSize() {
    const [windowSize, setWindowSize] = useState(getWindowSize());
    const dispatch = useAppDispatch()

    useEffect(() => {
        function handleResize() {
            const size = getWindowSize()
            setWindowSize(size);
            dispatch(setResizedValue(size.width))
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {windowSize: windowSize, isMobile: checkSize(700, windowSize.width), isTablet: checkSize(1000, windowSize.width)};
}

function checkSize(pixels: number, currentWidth: number) {
    return currentWidth < pixels
}

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector


export function usePWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const promptInstall = async () => {
        if (!deferredPrompt) return;

        // @ts-ignore
        deferredPrompt.prompt();

        // @ts-ignore
        const { outcome } = await deferredPrompt.userChoice;
        console.log("User response: ", outcome);

        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    return { isInstallable, promptInstall };
}

export const isIOS = () =>
    /iphone|ipad|ipod/i.test(window.navigator.userAgent);

export function isInStandaloneMode(){
// @ts-ignore
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
}


