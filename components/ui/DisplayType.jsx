import styles from "@/sass/components/ui/display-type.module.scss";
import { Grid3x3, List } from "lucide-react";
const DisplayType = ({view,onChange}) => {
    return (
        <div className={styles.displayType}>
            <button aria-label="Switch to grid view" className={`${styles.btn} ${view === "grid" ? styles.active : ""}`} onClick={() => onChange("grid")}>
                <Grid3x3 className={styles.icon} />
            </button>
            <button aria-label="Switch to list view" className={`${styles.btn} ${view === "list" ? styles.active : ""}`} onClick={() => onChange("list")}>
                <List className={styles.icon} />
            </button>

        </div>
    );
};

export default DisplayType;