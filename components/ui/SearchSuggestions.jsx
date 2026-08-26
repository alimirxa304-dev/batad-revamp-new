import styles from '@/sass/components/ui/search-suggestions.module.scss';

function highlight(text, query) {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
        <>
            {text.slice(0, idx)}
            <mark className={styles.highlight}>{text.slice(idx, idx + query.length)}</mark>
            {text.slice(idx + query.length)}
        </>
    );
}

export default function SearchSuggestions({ suggestions, isLoading, onSelect, visible, query }) {
    if (!visible) return null;

    return (
        <ul className={styles.dropdown} role="listbox">
            {isLoading && (
                <>
                    {[...Array(5)].map((_, i) => (
                        <li key={i} className={styles.skeleton} aria-hidden="true">
                            <span className={styles.skeletonLine} style={{ width: `${55 + i * 9}%` }} />
                        </li>
                    ))}
                </>
            )}

            {!isLoading && suggestions.length === 0 && (
                <li className={styles.state}>No results found</li>
            )}

            {!isLoading && suggestions.map((course) => (
                <li
                    key={course.id}
                    className={styles.item}
                    role="option"
                    aria-selected={false}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onSelect(course)}
                >
                    {highlight(course.name, query)}
                </li>
            ))}
        </ul>
    );
}
