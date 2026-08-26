import styles from "@/sass/pages/blog/search.module.scss";
import stylesContainer from "@/sass/components/common/container.module.scss";
import { Search } from "lucide-react";

const SearchInput = ({updateFilter}) => {
    return (
        <div className={styles.search}>
                <div className={styles.searchContent}>
                    <div className={styles.searchContent__left}>
                        <div className={styles.searchContent__left__icon}>
                      <Search size={13} color="#99A1AF"/>

                    </div>
                    <input  type="text" placeholder="Search articles, topics, or authors..." className={styles.input} onChange={(e) => updateFilter('search', e.target.value)} />
                </div>
                <div className={styles.searchContent__right}>
                    <button>Search</button>
                </div>
            </div>
        </div>
    );
};

export default SearchInput;