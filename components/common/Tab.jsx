import styles from '@/sass/components/common/tab.module.scss';
import Link from 'next/link';



const Tab = ({ tab, isActive, onClick, className, activeClassName }) => {
    return (
        <div className={`${styles.tab} ${className || ''} ${isActive ? `${styles.active} ${activeClassName || ''}` : ''}`}
            onClick={onClick}>
            {/* <span className={styles.tabIcon}>
                {tab.icon}
            </span> */}
            <span className={styles.tabTitle}>
                {tab.title}
            </span>
        </div>
    )

}

export default Tab