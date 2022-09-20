import React, { memo } from 'react';
import cn from 'classnames';
import Icon from '@/components/Icon';
import './index.less';

interface EmptyProps {
  className?: string;
  description?: string;
  style?: React.CSSProperties;
}

function Empty(props: EmptyProps) {
  const { className = '', description = 'No Data', style } = props;
  return (
    <div className={cn('ait-empty', { [className]: !!className })} style={style}>
      <div className="ait-empty-image">
        <Icon name="empty" className="ait-empty-image-icon" />
      </div>
      <p className="ait-empty-description">{description}</p>
    </div>
  );
}

export default memo(Empty);
