import styles from "@/sass/pages/consulting/consulting-details/overview.module.scss";
import { Check, CircleCheck } from "lucide-react";

const Overview = ({overview}) => {
    return (
        <div className={styles.overview}>
            <div className={styles.top}>
                <h3>{overview?.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: overview?.content }} />
                {/* <p>{overview?.description}</p> */}

            </div>

            <div className={styles.bottom}>
                <h3>{overview?.included_title}</h3>
                <div dangerouslySetInnerHTML={{ __html: overview?.included }} />
                {/* <ul>
                    <li>
                        <span> <Check size={12} /></span>
                        Market analysis and competitive positioning
                    </li>

                    <li>
                        <span> <Check size={12} /></span>
                        Market analysis and competitive positioning
                    </li>
                    <li>
                        <span> <Check size={12} /></span>
                        Market analysis and competitive positioning
                    </li>
                    <li>
                        <span> <Check size={12} /></span>
                        Market analysis and competitive positioning
                    </li>
                </ul> */}
            </div>

        </div>
    );
};

export default Overview;