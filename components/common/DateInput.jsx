// components/CustomDatePicker/CustomDatePicker.tsx
"use client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import styles from "@/sass/components/common/DateInput.module.scss";


export default function CustomDatePicker({ label, placeholder = "DD / MM / YYYY", selected, onChange, className }) {
    return (
        <div className={`${styles.wrapper} ${className || ''}`}>
            {label && (
                <label className={styles.label}>
                    <Calendar size={14} color="#B12E33" />
                    {label}
                </label>
            )}
            <div className={styles.inputWrapper}>
                <DatePicker
                    selected={selected}
                    onChange={onChange}
                    placeholderText={placeholder}
                    dateFormat="dd / MM / yyyy"
                    className={styles.input}
                    calendarClassName={styles.calendar}
                    wrapperClassName={styles.datePickerWrapper}
                />
                <Calendar size={16} className={styles.icon} />
            </div>
        </div>
    );
}