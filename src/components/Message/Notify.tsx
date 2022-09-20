import React, { memo, useEffect, useState } from 'react';
import Icon from '@/components/Icon';
import './index.less';

function Notify(props: any) {
  const { title, duration, type, id, onClosed } = props;
  const [isClose, setClose] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      // 消息通知
      setClose(() => true);
      // 延迟 300ms 出发 onClosed 事件。此时动画已执行结束。
      setTimeout(() => onClosed(id), 300);
    }, duration);
  }, []);

  return (
    <div className={`ait-message-notify${isClose ? ' hide' : ''}`}>
      <div className="ait-message-notify-container">
        <Icon name={type} className={`ait-message-notify-container-icon ${type}`} />
        {title}
      </div>
    </div>
  );
}

export default memo(Notify);
