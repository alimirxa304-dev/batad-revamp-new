'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from '@/sass/components/common/tabs.module.scss'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
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

// `scrollArrows`: on phones the row overflows sideways; opt in to chevrons
// on either side that scroll it (each hides at its own edge, RTL-aware), and
// the active tab is scrolled into view when it changes.
const Tabs = ({ activeTabId, onTabChange, tabs = tabsItem, className, tabClassName, activeTabClassName, scrollArrows = false }) => {
    const trackRef = useRef(null)
    const [edges, setEdges] = useState({ atStart: true, atEnd: true })

    // Compares bounding boxes rather than scrollLeft, whose sign convention in
    // RTL differs across browsers.
    const measure = useCallback(() => {
        const el = trackRef.current
        if (!el || !el.children.length) return { atStart: true, atEnd: true }
        const rtl = getComputedStyle(el).direction === 'rtl'
        const track = el.getBoundingClientRect()
        const first = el.children[0].getBoundingClientRect()
        const last = el.children[el.children.length - 1].getBoundingClientRect()
        return rtl
            ? { atStart: first.right <= track.right + 1, atEnd: last.left >= track.left - 1 }
            : { atStart: first.left >= track.left - 1, atEnd: last.right <= track.right + 1 }
    }, [])

    useEffect(() => {
        if (!scrollArrows) return undefined
        const el = trackRef.current
        const update = () => setEdges(measure())
        update()
        el?.addEventListener('scroll', update, { passive: true })
        window.addEventListener('resize', update)
        return () => {
            el?.removeEventListener('scroll', update)
            window.removeEventListener('resize', update)
        }
    }, [scrollArrows, measure, tabs])

    // Keep the selected tab visible (e.g. after tapping a half-hidden one).
    useEffect(() => {
        if (!scrollArrows) return
        const el = trackRef.current
        const idx = tabs.findIndex((t) => t.id === activeTabId)
        const child = el?.children[idx]
        if (child && el.scrollWidth > el.clientWidth) {
            child.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
        }
    }, [activeTabId, scrollArrows, tabs])

    const scrollBy = (dir) => {
        const el = trackRef.current
        if (!el) return
        const rtl = getComputedStyle(el).direction === 'rtl'
        el.scrollBy({ left: dir * (rtl ? -1 : 1) * el.clientWidth * 0.6, behavior: 'smooth' })
    }

    const track = (
        <div ref={trackRef} className={`${styles.tabs} ${className || ''}`}>
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

    if (!scrollArrows) return track

    // Chevrons follow reading direction (start/end), so the icons are swapped
    // in RTL where "start" is on the right.
    const StartIcon = ChevronLeft
    const EndIcon = ChevronRight
    return (
        <div className={styles.tabsRow}>
            {!edges.atStart && (
                <button
                    type="button"
                    className={styles.tabsChevron}
                    onClick={() => scrollBy(-1)}
                    aria-label="Scroll tabs back"
                >
                    <StartIcon size={18} style={{ transform: 'var(--tabs-chevron-flip, none)' }} />
                </button>
            )}
            {track}
            {!edges.atEnd && (
                <button
                    type="button"
                    className={styles.tabsChevron}
                    onClick={() => scrollBy(1)}
                    aria-label="Scroll tabs forward"
                >
                    <EndIcon size={18} style={{ transform: 'var(--tabs-chevron-flip, none)' }} />
                </button>
            )}
        </div>
    )
}

export default Tabs
