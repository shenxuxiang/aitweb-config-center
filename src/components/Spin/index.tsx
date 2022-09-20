import React, { memo, useMemo, useState, useLayoutEffect } from 'react';
import styles from './index.module.less';

interface IProps {
  children?: React.ReactNode;
  delay?: number;
  spinning: boolean;
}

function Spin(props: IProps) {
  const { children, delay, spinning } = props;
  const [isClosed, setCloseSpin] = useState(spinning);

  useLayoutEffect(() => {
    // eslint-disable-next-line
    if (delay == null) {
      setCloseSpin(() => !spinning);
      return;
    }
    setTimeout(() => setCloseSpin(() => !spinning), delay);
  }, [spinning]);

  const renderDot = useMemo(
    () => (
      <div className={styles.ait_spin}>
        <div className={styles.ait_spin_dot}>
          <div className={styles.ait_spin_dot_item} />
          <div className={styles.ait_spin_dot_item} />
          <div className={styles.ait_spin_dot_item} />
          <div className={styles.ait_spin_dot_item} />
        </div>
      </div>
    ),
    [],
  );

  // eslint-disable-next-line
  if (children == null) return isClosed ? null : renderDot;

  return (
    <div className={styles.ait_spin_box}>
      <div className={`${styles.ait_spin_spinning}${isClosed ? ` ${styles.hide}` : ''}`}>
        <div className={styles.ait_spin_spinning_center}>{renderDot}</div>
      </div>

      <div className={`${styles.ait_spin_container}${isClosed ? '' : ` ${styles.ait_spin_mask}`}`}>{children}</div>
    </div>
  );
}

export default memo(Spin);
