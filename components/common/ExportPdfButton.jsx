"use client";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { Download, FileText, FileSpreadsheet, X, CheckCircle, RotateCw, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "@/sass/components/common/export-pdf.module.scss";

// Icon-only "Download PDF" button → Export PDF/Excel dropdown → Download
// Request modal (Name/Email/CAPTCHA). Frontend-only: there's no backend
// endpoint to actually generate/send a file, so submitting just mocks a
// short delay and a success state. Shared by any listing page (courses,
// specialisations, ...) that offers this export flow — first built for
// /search_course, extracted here so other pages don't duplicate it.
const ExportPdfButton = () => {
    const t = useTranslations("SearchCourse");
    const [isOpen, setIsOpen] = useState(false);
    const [exportFormat, setExportFormat] = useState("pdf");
    const [formData, setFormData] = useState({ name: "", email: "", captcha: "" });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [captchaCode, setCaptchaCode] = useState("");

    const generateCaptcha = () => Math.random().toString(36).slice(2, 7).toUpperCase();

    const openModal = (format) => {
        setExportFormat(format);
        setCaptchaCode(generateCaptcha());
        setFormData({ name: "", email: "", captcha: "" });
        setFormErrors({});
        setSubmitStatus(null);
        setIsOpen(true);
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = t("fullName") + " is required";
        if (!formData.email.trim()) errors.email = t("email") + " is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email format";
        if (!formData.captcha.trim()) errors.captcha = t("captcha") + " is required";
        else if (formData.captcha.trim().toUpperCase() !== captchaCode) errors.captcha = t("captchaMismatch");
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        setSubmitStatus(null);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setSubmitStatus("success");
            setFormData({ name: "", email: "", captcha: "" });
            setTimeout(() => {
                setIsOpen(false);
                setSubmitStatus(null);
            }, 2000);
        } catch {
            setSubmitStatus("error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    return (
        <>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button className={styles.pdfBtn} type="button" aria-label={t("downloadPDF")} title={t("downloadPDF")}>
                        <Download size={18} aria-hidden="true" />
                    </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content className={styles.exportMenu} align="end" sideOffset={6}>
                        <DropdownMenu.Item className={styles.exportMenuItem} onSelect={() => openModal("pdf")}>
                            <FileText size={16} aria-hidden="true" /> {t("exportPdf")}
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className={styles.exportMenuItem} onSelect={() => openModal("excel")}>
                            <FileSpreadsheet size={16} aria-hidden="true" /> {t("exportExcel")}
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className={styles.pdfModalOverlay} />
                    <Dialog.Content className={styles.pdfModalContent}>
                        <div className={styles.pdfModalHeader}>
                            <Dialog.Title className={styles.pdfModalTitle}>{t("pdfDownloadTitle")}</Dialog.Title>
                            <Dialog.Close className={styles.pdfModalClose}>
                                <X size={20} aria-hidden="true" />
                            </Dialog.Close>
                        </div>
                        {submitStatus === "success" ? (
                            <div className={styles.pdfSuccess}>
                                <CheckCircle size={48} className={styles.successIcon} />
                                <p className={styles.successMessage}>{t("successMessage")}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className={styles.pdfForm}>
                                <div className={styles.pdfFormGroup}>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className={`${styles.pdfFormInput} ${formErrors.name ? styles.error : ""}`}
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder={t("enterName")}
                                        disabled={submitting}
                                    />
                                    {formErrors.name && <span className={styles.errorMessage}>{formErrors.name}</span>}
                                </div>
                                <div className={styles.pdfFormGroup}>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className={`${styles.pdfFormInput} ${formErrors.email ? styles.error : ""}`}
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder={t("enterEmail")}
                                        disabled={submitting}
                                    />
                                    {formErrors.email && <span className={styles.errorMessage}>{formErrors.email}</span>}
                                </div>
                                <div className={styles.pdfFormGroup}>
                                    <div className={styles.captchaRow}>
                                        <div className={styles.captchaCode} aria-hidden="true">
                                            {captchaCode.split("").map((ch, i) => (
                                                <span key={i} style={{ "--rot": `${(i % 2 === 0 ? -1 : 1) * (6 + i * 2)}deg` }}>{ch}</span>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.captchaRefresh}
                                            onClick={() => setCaptchaCode(generateCaptcha())}
                                            aria-label={t("refreshCaptcha")}
                                            disabled={submitting}
                                        >
                                            <RotateCw size={16} aria-hidden="true" />
                                        </button>
                                        <input
                                            type="text"
                                            id="captcha"
                                            name="captcha"
                                            className={`${styles.pdfFormInput} ${styles.captchaInput} ${formErrors.captcha ? styles.error : ""}`}
                                            value={formData.captcha}
                                            onChange={handleInputChange}
                                            placeholder={t("enterCaptcha")}
                                            disabled={submitting}
                                        />
                                    </div>
                                    {formErrors.captcha && <span className={styles.errorMessage}>{formErrors.captcha}</span>}
                                </div>
                                {submitStatus === "error" && <p className={styles.errorMessage}>{t("errorMessage")}</p>}
                                <button type="submit" className={styles.pdfSubmitBtn} disabled={submitting}>
                                    {submitting ? (
                                        <>
                                            <Loader2 size={18} className={styles.spinner} /> {t("submitting")}
                                        </>
                                    ) : (
                                        t("submit")
                                    )}
                                </button>
                            </form>
                        )}
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
};

export default ExportPdfButton;
