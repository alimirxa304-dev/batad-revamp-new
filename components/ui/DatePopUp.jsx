"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Calendar } from "lucide-react";
import styles from "@/sass/components/ui/Date-pop-up.module.scss";
import NoData from "../common/NoData";


const DatePopUp = ({ isOpen, onClose, onSelect, courseName, dates,id }) => {
  const overlayRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // ✅ Stop ALL pointer events from bubbling up to Swiper
  const handleModalPointerDown = (e) => {
    e.stopPropagation();
  };

  const modalContent = (
    <div
      ref={overlayRef}
      className={styles.overlay}
      onClick={handleOverlayClick}
      onPointerDown={handleModalPointerDown}
      onTouchStart={handleModalPointerDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <Calendar size={20} aria-hidden="true" />
            </div>
            <div>
              <h2 id="modal-title" className={styles.title}>
                Choose Your Session
              </h2>
              <p className={styles.subtitle}>{courseName}</p>
            </div>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Session List */}
        <div className={styles.body}>
          {dates?.length > 0 ? (
            dates?.map((session) => (
              <div
                key={session?.id}
                className={`${styles.sessionRow} ${session?.featured ? styles.featured : ""}`}
              >
                <div className={styles.sessionIcon}>
                  <Calendar size={18} aria-hidden="true" />
                </div>
                <div className={styles.sessionInfo}>
                  <span className={styles.sessionDate}>{session.date}</span>
                  <span className={styles.sessionLabel}>{session.label}</span>
                </div>
                <button
                  className={styles.selectBtn}
                  onClick={() => {
                    onSelect(session);
                    onClose();
                  }}
                >
                  Register
                </button>
              </div>
            ))
          ) : (
            <NoData message="No Available Sessions" />
          )}
        </div>
      </div>
    </div>
  );

  // ✅ Render outside Swiper DOM entirely
  return createPortal(modalContent, document.body);
};

export default DatePopUp;
