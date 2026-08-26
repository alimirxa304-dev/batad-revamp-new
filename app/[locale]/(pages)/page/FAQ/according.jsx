import styles from "@/sass/pages/fqa/according.module.scss";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, CircleQuestionMark } from "lucide-react";

const According = ({ variant = "popular", question, answer }) => (
    <Accordion.Root type="single" collapsible>
        <Accordion.Item value="item-1" className={styles.item} data-variant={variant}>
            <Accordion.Header className={styles.header}>
                <Accordion.Trigger className={styles.trigger}>
                    <span className={styles.icon}>
                        <CircleQuestionMark color="#FFFFFF" size={20} />
                    </span>
                    <h2>{question}</h2>
                    <ChevronDown className={styles.chevron} />
                </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className={styles.content}>
               <div className={styles.contentInner}>
                   <p>{answer}</p>
               </div>
            </Accordion.Content>
        </Accordion.Item>
    </Accordion.Root>
);

export default According;