'use client';
import styles from '@/sass/components/ui/range.module.scss';
import * as Slider from '@radix-ui/react-slider';
import { useEffect, useState } from 'react';

const Range = ({ min, max, step = 10, onChange }) => {
  const [values, setValues] = useState([min ?? 0, max ?? 1000]);

  // Sync state with props when they change (critical for async data)
  useEffect(() => {
    if (min !== undefined && max !== undefined && min !== null && max !== null) {
      setValues([min, max]);
    }
  }, [min, max]);

  const handleChange = (vals) => {
    setValues(vals);
    onChange?.({ min: vals[0], max: vals[1] });
  };

  // Prevent crashing if min/max are not yet available
  if (min === undefined || max === undefined || min === null || max === null) {
    return null;
  }

  return (
    <div className={styles.rangeWrapper}>
      <Slider.Root
        className={styles.rangeRoot}
        min={min}
        max={max}
        step={step}
        value={values}
        onValueChange={handleChange}
        minStepsBetweenThumbs={1}
      >
        <Slider.Track className={styles.rangeTrack}>
          <Slider.Range className={styles.rangeRange} />
        </Slider.Track>

        <Slider.Thumb className={styles.rangeThumb} aria-label="Minimum price" />
        <Slider.Thumb className={styles.rangeThumb} aria-label="Maximum price" />
      </Slider.Root>

      <div className={styles.rangeLabels}>
        <span>{values[0]}$</span>
        <span>{values[1]} $</span>
      </div>
    </div>
  );
};

export default Range;