"use client";
import { LayoutGrid, List } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "@/sass/components/common/view-toggle.module.scss";

// Grid/List view toggle — shared by any listing page that offers both.
const ViewToggle = ({ viewMode, setViewMode }) => {
    const t = useTranslations("SearchCourse");
    return (
        <div className={styles.viewToggle}>
            <button
                className={`${styles.viewBtn} ${viewMode === "grid" ? styles.active : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label={t("gridView")}
                title={t("gridView")}
                type="button"
            >
                <LayoutGrid size={18} />
            </button>
            <button
                className={`${styles.viewBtn} ${viewMode === "list" ? styles.active : ""}`}
                onClick={() => setViewMode("list")}
                aria-label={t("listView")}
                title={t("listView")}
                type="button"
            >
                <List size={18} />
            </button>
        </div>
    );
};

export default ViewToggle;
