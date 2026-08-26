import Image from "next/image";
import styles from "@/sass/components/common/latest-posts-card.module.scss";
import { Heart, MessageCircle, Repeat2 } from "lucide-react";

// Temporary placeholder images
const placeholderImages = [
    "https://placehold.co/600x400/png?text=Image+1",
    "https://placehold.co/600x400/png?text=Image+2",
    "https://placehold.co/600x400/png?text=Image+3",
];

const LatestPostsCard = ({item}) => {
    // Select a random image based on the item's ID or randomly.
    const randomImageIndex = item?.id ? item.id % 3 : Math.floor(Math.random() * 3);
    const randomImage = placeholderImages[randomImageIndex];

    return (
        <div className={styles.card}>
            <div className={styles.left}>
                <Image src={item.authorImage} alt="" width={100} height={100} />
            </div>
            <div className={styles.right}>
                <div className={styles.info}>
                   <div className={styles.username}>
                    <h3>{item.userName}</h3>
                    <span className={styles.point}>.</span>
                    <span>{item.date}</span>

                   </div>
                   <p>
                    {item.description}
                   </p>
                </div>
              <Image src={randomImage} alt="" width={100} height={100} className={styles.image} unoptimized />

              <div className={styles.social}>
                <div className={styles.reaction}>
                    <MessageCircle color="#6A7282" size={14}/>
                    <span>Reply </span>


                </div>
                    <div className={styles.reaction}>
                    <Repeat2 color="#6A7282" size={14}/>
                    <span>Reply </span>


                </div>
                    <div className={styles.reaction}>
                    <Heart color="#6A7282" size={14}/>
                    <span>Reply </span>


                </div>
              </div>
            </div>
        </div>
    );
};

export default LatestPostsCard;