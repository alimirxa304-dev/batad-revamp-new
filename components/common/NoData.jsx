import { FileText } from "lucide-react";
import styles from '@/sass/components/common/no-data.module.scss'
const NoData = ({ message }) => {
    return (
        <div className={styles.noData}>
            <FileText size={48} strokeWidth={2} />
            <p>{message}</p>
        </div>
    );
};

export default NoData;