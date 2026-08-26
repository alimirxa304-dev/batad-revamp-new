'use client';
import { motion } from 'framer-motion';

export const fadeInUp = {
    initial: { opacity: 1, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export const hoverScale = {
    whileHover: { scale: 1.02, y: -5 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 17 }
};

export const MotionDiv = motion.div;
export const MotionSection = motion.section;

const MotionWrapper = ({ children, variants = fadeInUp, ...props }) => {
    return (
        <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            variants={variants}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default MotionWrapper;
