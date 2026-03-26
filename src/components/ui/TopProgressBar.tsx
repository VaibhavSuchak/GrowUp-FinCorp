import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const TopProgressBar = () => {
    const location = useLocation();
    const [isAnimating, setIsAnimating] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setIsAnimating(true);
        setProgress(30);

        const timer = setTimeout(() => {
            setProgress(70);
        }, 200);

        const completeTimer = setTimeout(() => {
            setProgress(100);
            setTimeout(() => {
                setIsAnimating(false);
                setProgress(0);
            }, 300);
        }, 600);

        return () => {
            clearTimeout(timer);
            clearTimeout(completeTimer);
        };
    }, [location.pathname]);

    return (
        <AnimatePresence>
            {isAnimating && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, #2ec4b6, #3b82f6)',
                        boxShadow: '0 0 10px rgba(46, 196, 182, 0.5)',
                        zIndex: 9999,
                    }}
                >
                    <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        style={{
                            height: '100%',
                            background: '#fff',
                            boxShadow: '0 0 15px #fff',
                            borderRadius: '0 2px 2px 0',
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TopProgressBar;
