import styles from "@/sass/pages/consulting/consulting-details/client-testimonials.module.scss";
import { Star } from "lucide-react";

const ClientTestimonials = ({ testimonials }) => {
    return (
        <div className={styles.clientTestimonials}>
            <h2>
                {testimonials?.title}
            </h2>

            <div className={styles.cards}>
                {
                    testimonials?.items?.map((item) => {
                        return (
                            <div className={styles.card}>
                                <div className={styles.stars}>
                                    {Array.from({ length: item?.rating }).map((_, index) => {
                                        return (
                                            <Star fill="#F0B100" size={18} key={index} />
                                        )
                                    })}
                                </div>
                                <p>{item?.quote}</p>
                                <span className={styles.name}>
                                    {item?.author}, {item.position}
                                </span>

                            </div>
                        )
                    })
                }
            
              
            </div>

        </div>
    );
};

export default ClientTestimonials;