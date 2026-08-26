import styles from '@/sass/components/common/tabs.module.scss'
import { Heart } from 'lucide-react'
import Tab from './Tab'

const tabsItem = [
    {
        id: 1,
        icon: <Heart />,
        title: 'All Courses',
        content: 'All Courses'
    },
    {
        id: 2,
        icon: <Heart />,
        title: 'Upcoming Courses',
        content: 'Upcoming Courses'
    },
    {
        id: 3,
        icon: <Heart />,
        title: 'Past Courses',
        content: 'Past Courses'
    }
]
const Tabs = ({ activeTabId, onTabChange, tabs = tabsItem, className, tabClassName, activeTabClassName }) => {
    return (
        <div className={`${styles.tabs} ${className || ''}`}>
            {tabs.map((tab) => (
                <Tab
                    key={tab.id}
                    tab={tab}
                    isActive={tab.id === activeTabId}
                    onClick={() => onTabChange?.(tab.id)}
                    className={tabClassName}
                    activeClassName={activeTabClassName}
                />
            ))}
        </div>
    )
}

export default Tabs