'use client';
import { useState, useEffect } from "react";
import DropdownMenuCustom from "@/components/common/DropdownMenu";
import { ChevronDown, FileSpreadsheet, MoveLeft, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams, useParams } from "next/navigation";
import styles from "@/sass/pages/print-category/print.module.scss";
import container from "@/sass/components/common/container.module.scss";
import { useTranslations } from "next-intl";
import usePlansStore from "@/store/usePlansStore";

const escapeCsvCell = (value) => {
    const str = String(value ?? "");
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

const Print = () => {
    const t = useTranslations('PrintCategory');
    const { locale, id } = useParams();
    const [location, setLocation] = useState('');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { plan } = usePlansStore();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const itemsCount = plan?.courses?.items?.length || 0;

    const handleExportExcel = () => {
        const items = plan?.courses?.items || [];
        const isAr = locale === 'ar';
        const headers = isAr
            ? ['الدورة التدريبية', 'التصنيف', 'التخصص', 'تاريخ الانعقاد 1', 'تاريخ الانعقاد 2', 'تاريخ الانعقاد 3', 'تاريخ الانعقاد 4', 'السعر / أسبوع', 'السعر / أسبوعين', 'السعر / 3 أسابيع']
            : ['Course', 'Category', 'Specialization', 'Date 1', 'Date 2', 'Date 3', 'Date 4', 'Price / Week', 'Price / Two Weeks', 'Price / 3 Weeks'];

        const rows = items.map((item) => {
            const dates = item?.dates || [];
            const pricing = item?.pricing || {};
            return [
                item?.name,
                item?.category?.name,
                item?.specialization?.name,
                dates[0]?.date,
                dates[1]?.date,
                dates[2]?.date,
                dates[3]?.date,
                pricing.week?.price,
                pricing['two-week']?.price,
                pricing['3-week']?.price,
            ].map(escapeCsvCell).join(',');
        });

        // Leading BOM so Excel auto-detects UTF-8 and renders Arabic correctly
        // instead of mojibake.
        const BOM = String.fromCharCode(0xfeff);
        const csvContent = BOM + [headers.map(escapeCsvCell).join(','), ...rows].join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `year-plan-${id}-courses.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            if (searchTerm) {
                params.set('search', searchTerm);
            } else {
                params.delete('search');
            }
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, pathname, router, searchParams]);

    return (
        <div className={styles.print}>
            <div className={container.container}>
                <div className={styles.wrapper}>
                    <div className={styles.top}>
                        <DropdownMenuCustom
                            label={t('allLocations')}
                            options={[t('allLocations'), "Location 1", "Location 2"]}
                            value={location}
                            onChange={(val) => setLocation(val)}
                            multi={false}
                            icon={<ChevronDown size={14} />}
                            triggerClassName={styles.dropdownTrigger}
                        />
                        <div className={styles.searchContent}>
                            <div className={styles.searchContent__left}>
                                <div className={styles.searchContent__left__icon}>
                                    <Search size={13} color="#99A1AF" />
                                </div>
                                <input
                                    type="text"
                                    placeholder={t('searchPlaceholder')}
                                    className={styles.input}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <button className={styles.printBtn} onClick={handleExportExcel}>
                            <FileSpreadsheet /> {t('exportExcel')}
                        </button>
                    </div>

                    <div className={styles.bottom}>
                        <h3>
                            {t('showing')}
                            <span className={styles.count}> {itemsCount} </span>
                            {t('courses')}
                        </h3>
                        <Link href={`/${locale}/year_plan`} className={styles.back}>
                            <MoveLeft />
                            {t('backToYearPlan')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Print;
