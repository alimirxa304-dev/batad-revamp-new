import styles from "@/sass/pages/blog/reactions.module.scss";
import { Bookmark, Heart, MessageCircle, Share2 } from "lucide-react";
const Reactions = () => {
    return (
        <div className={styles.reactions}>
            <div className={styles.icon}>
                <Heart color="#4A5565" size={20} />
            </div>
            <div className={styles.icon}>

                <MessageCircle color="#4A5565" size={20} />
            </div>
            <div className={styles.icon}>

                <Bookmark color="#4A5565" size={20} />
            </div>

            <div className={styles.icon}>
                <Share2 color="#4A5565" size={20} />
            </div>

        </div>
    );
};

export default Reactions;  