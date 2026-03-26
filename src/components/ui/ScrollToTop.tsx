import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTopEnhanced = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        const forceScrollToTop = () => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant'
            });

            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;

            if (document.scrollingElement) {
                document.scrollingElement.scrollTop = 0;
            }
        };

        // Execute immediately upon pathname change or initial load
        forceScrollToTop();

        // Redundant checks to ensure it happens after DOM paints
        const timeout1 = setTimeout(forceScrollToTop, 0);
        const animationFrame = requestAnimationFrame(forceScrollToTop);
        const timeout2 = setTimeout(forceScrollToTop, 50);

        return () => {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
            cancelAnimationFrame(animationFrame);
        };
    }, [pathname]);

    return null;
};

export default ScrollToTopEnhanced;
