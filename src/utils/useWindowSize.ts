import { useState, useEffect } from 'react';

function getWindowSize() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

export default function useWindowSize() {
    const [windowSize, setWindowSize] = useState(getWindowSize());

    useEffect(() => {
        function handleResize() {
            setWindowSize(getWindowSize());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}

export function useMobileSize() {
    return useWindowSize().width < 700
}
export function useTabletSize() {
    return useWindowSize().width < 1000
}