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

