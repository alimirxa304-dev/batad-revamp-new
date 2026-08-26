import styles from "@/sass/components/common/select-categories.module.scss";

const SelectCategories = ({ category, onClick, isActive }) => {
    return (
        <div className={styles.selectCategories}>
            <div className={styles.item}>
                <div className={styles.item__content}>
                    <label className={styles.checkbox}>
                        <input type="checkbox" onChange={onClick} checked={isActive || false} />
                        <span className={styles.custom}></span>
                    </label>
                    <h1 className={styles.name}>{category.name}</h1>
                </div>
                <span>{category.posts_count}</span>
            </div>
        </div>
    );
};

export default SelectCategories;