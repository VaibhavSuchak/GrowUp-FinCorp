import { motion } from 'framer-motion';

interface ScrollRevealProps {
    children: React.ReactNode;
    delay?: number;
    stagger?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    className?: string;
    style?: React.CSSProperties;
}

const ScrollReveal = ({
    children,
    delay = 0,
    stagger = 0.1,
    direction = 'up',
    className = '',
    style = {}
}: ScrollRevealProps) => {

    const getInitialProps = () => {
        switch (direction) {
            case 'up': return { y: 40, opacity: 0 };
            case 'down': return { y: -40, opacity: 0 };
            case 'left': return { x: 40, opacity: 0 };
            case 'right': return { x: -40, opacity: 0 };
            default: return { y: 40, opacity: 0 };
        }
    };

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: stagger,
                delayChildren: delay,
            },
        },
    };

    const itemVariants = {
        hidden: {
            ...getInitialProps(),
            scale: 0.95
        },
        visible: {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1] as any, // Quintic out
            },
        },
    };

    // If there's only one child, we apply variants directly to it if it's a motion element,
    // but better to wrap it in a motion.div for consistency.

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className={className}
            style={style}
        >
            {Array.isArray(children) ? (
                children.map((child, i) => (
                    <motion.div key={i} variants={itemVariants}>
                        {child}
                    </motion.div>
                ))
            ) : (
                <motion.div variants={itemVariants}>
                    {children}
                </motion.div>
            )}
        </motion.div>
    );
};

export default ScrollReveal;
