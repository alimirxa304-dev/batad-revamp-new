import styles from '@/sass/components/ui/skeleton.module.scss';

const Skeleton = ({ className, style, type = 'text', width, height, count = 1 }) => {
    const elements = [];
    
    for (let i = 0; i < count; i++) {
        elements.push(
            <div
                key={i}
                className={`${styles.skeleton} ${styles[type]} ${className || ''}`}
                style={{ width, height, ...style }}
            />
        );
    }

    if (count === 1) return elements[0];

    return (
        <div className={styles.skeletonGroup}>
            {elements}
        </div>
    );
};

export default Skeleton;
