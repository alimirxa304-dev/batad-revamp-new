import styles from "@/sass/pages/consulting/consulting-details/process.module.scss";

const Process = ({process}) => {
    return (
        <div className={styles.process}>
            <h2>
                {process?.title}
            </h2>
            <div className={styles.content}>
                   {
                       process?.steps?.map((step, index) => {
                            return (
                           <div key={index} className={styles.item}>
                    <span>
                        {step?.step}
                    </span>

                    <div className={styles.info}>
                        <h3>{step?.title}</h3>
                        <p>{step?.description}</p>

                    </div>

                </div>
                )
                    })
                }
             
             

            </div>
        </div>
    );
};

export default Process;