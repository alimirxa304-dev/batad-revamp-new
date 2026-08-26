'use client';
import { motion } from 'framer-motion';
import styles from '@/sass/components/common/title.module.scss';

const Title = ({ title, span, subtitle }) => {
    return (
        <motion.div 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <h2>{title} <span>{span} </span></h2>
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                {subtitle}
            </motion.p>
        </motion.div>
    );
};

export default Title;