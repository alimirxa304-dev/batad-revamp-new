"use client";
import styles from "@/sass/pages/showCities/show-cities.module.scss";
import Header from "./Header";
import stylesContainer from "@/sass/components/common/container.module.scss";
import CityCard from "./CityCard";
import { getCities } from "@/action/cities";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname, useParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

const ShowCities = ({ initialCities, initialStats, initialHasMore, initialNextCursor }) => {
    const t = useTranslations('ShowCities')
    const locale = useLocale();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { locale: routeLocale } = useParams();
    const [cities, setCities] = useState(initialCities);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [nextCursor, setNextCursor] = useState(initialNextCursor);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    useEffect(() => {
        const citySlug = searchParams.get("city");
        const specialization = searchParams.get("specialization");
        const search = searchParams.get("search");

        if ((citySlug || specialization || search) && cities.length > 0) {
            let targetCity;

            if (citySlug) {
                targetCity = cities.find((c) => c.slug === citySlug);
            } else {
                // If no city selected but other filters are present, use the first city
                targetCity = cities[0];
            }

            if (targetCity) {
                const params = new URLSearchParams(searchParams.toString());
                // Remove city from query params as it will be in the URL path
                params.delete("city");
                const queryString = params.toString() ? `?${params.toString()}` : "";
                router.push(`/${routeLocale}/city/${targetCity.id}/${targetCity.slug}${queryString}`);
            }
        }
    }, [searchParams, cities, routeLocale, router]);

    const updateFilter = (key, value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const onLoadMore = async () => {
        if (!nextCursor) return;
        setIsLoadingMore(true);
        try {
            const res = await getCities(locale, `?cursor=${nextCursor}`);
            const d = res?.data;
            setCities((prev) => [...prev, ...(d?.cities || [])]);
            setHasMore(d?.has_more || false);
            setNextCursor(d?.next_cursor || null);
        } finally {
            setIsLoadingMore(false);
        }
    };

    return (
        <div className={styles.showCities}>
            <Header updateFilter={updateFilter} initialStats={initialStats} />

            <div className={styles.mainContent}>
                <div className={stylesContainer.container}>
                    <div className={styles.content}>
                        <div className={styles.title}>
                            <h2> {t('coursesByCity')} </h2>
                            <p> {t('citySubtitle')} </p>
                        </div>

                        <div className={styles.cities}>
                            {cities.map((city) => (
                                <CityCard key={city.id} city={city} />
                            ))}
                        </div>

                        {hasMore && (
                            <button onClick={onLoadMore} className={styles.loadMoreBtn} disabled={isLoadingMore}>
                                {t('viewMore')} <ArrowRight size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowCities;
