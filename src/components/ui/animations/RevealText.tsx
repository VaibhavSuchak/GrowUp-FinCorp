import { motion } from 'framer-motion';

interface RevealTextProps {
    text: string;
    type?: 'words' | 'chars';
    delay?: number;
    duration?: number;
    stagger?: number;
    className?: string;
    style?: React.CSSProperties;
}

const RevealText = ({
    text,
    type = 'words',
    delay = 0,
    duration = 0.8,
    stagger = 0.05,
    className = '',
    style = {}
}: RevealTextProps) => {
    const items = type === 'words' ? text.split(' ') : text.split('');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: stagger,
                delayChildren: delay,
            },
        },
    };

    const itemVariants = {
        hidden: {
            y: '100%',
            opacity: 0,
            rotateX: 45
        },
        visible: {
            y: 0,
            opacity: 1,
            rotateX: 0,
            transition: {
                duration: duration,
                ease: [0.22, 1, 0.36, 1] as any, // Custom cubic-bezier for a more professional feel
            },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className={className}
            style={{
                ...style,
                display: 'flex',
                flexWrap: 'wrap',
                overflow: 'hidden',
                perspective: '1000px'
            }}
        >
            {items.map((item, i) => (
                <span
                    key={i}
                    style={{
                        display: 'inline-block',
                        overflow: 'hidden',
                        marginRight: type === 'words' ? '0.25em' : '0'
                    }}
                >
                    <motion.span
                        variants={itemVariants}
                        style={{ display: 'inline-block' }}
                    >
                        {item === ' ' ? '\u00A0' : item}
                    </motion.span>
                </span>
            ))}
        </motion.div>
    );
};

export default RevealText;
