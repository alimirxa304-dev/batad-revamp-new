"use client";

import React, { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import styles from '@/sass/components/common/drop-down-menu.module.scss';
import { Search } from 'lucide-react';

const DropdownMenuCustom = ({
  label,
  options = [],
  value,
  onChange,
  multi = false,
  icon,
  alignRight = false,
  triggerClassName,
  hasSearch = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Helper to support both string and object options
  const getOptionLabel = (opt) => (typeof opt === 'object' && opt !== null ? opt.label : opt);
  const getOptionValue = (opt) => (typeof opt === 'object' && opt !== null ? opt.value : opt);

  const displayLabel = multi
    ? (!value || value.length === 0) ? label
      : value.length === 1 ? getOptionLabel(options.find(o => getOptionValue(o) === value[0]) || value[0])
      : `${value.length} selected`
    : getOptionLabel(options.find(o => getOptionValue(o) === value) || value) || label;

  const handleSelect = (opt, e) => {
    const val = getOptionValue(opt);
    if (multi) e.preventDefault();
    if (multi) {
      const currentValues = value || [];
      const next = currentValues.includes(val)
        ? currentValues.filter((v) => v !== val)
        : [...currentValues, val];
      onChange(next);
    } else {
      onChange(val);
    }
  };

  const filteredOptions = options.filter(opt =>
    getOptionLabel(opt)?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DropdownMenu.Root modal={false} onOpenChange={(open) => { if (!open) setSearchTerm(''); }}>
      <DropdownMenu.Trigger asChild>
        <button className={`${styles.trigger} ${triggerClassName || ""}`} type="button">
          <span className={styles.label}>{displayLabel}</span>
          {icon}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={styles.content}
          align={alignRight ? 'end' : 'start'}
          sideOffset={6}
          avoidCollisions
        >
          {hasSearch && (
            <div className={styles.searchContainer}>
              <Search size={14} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === ' ') e.stopPropagation();
                }}
              />
            </div>
          )}

          <div className={styles.list}>
            {filteredOptions.length === 0 && (
              <div className={styles.emptyState}>No results found</div>
            )}

            {filteredOptions.map((opt, i) => {
              const val = getOptionValue(opt);
              const lbl = getOptionLabel(opt);
              const isSelected = multi ? (value || []).includes(val) : value === val;

              return (
                <DropdownMenu.Item
                  key={`${val}-${i}`}
                  className={`${styles.item} ${isSelected ? styles.selected : ''}`}
                  onSelect={(e) => handleSelect(opt, e)}
                >
                  {multi && (
                    <span className={`${styles.checkbox} ${isSelected ? styles.checked : ''}`} />
                  )}
                  {lbl}
                  {!multi && isSelected && <span className={styles.dot} />}
                </DropdownMenu.Item>
              );
            })}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default DropdownMenuCustom;