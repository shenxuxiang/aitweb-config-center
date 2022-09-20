import React, { forwardRef, useRef, useLayoutEffect } from 'react';
import cn from 'classnames';
import { throttle } from '@/utils';
import './index.less';

interface IProps {
  disabled?: boolean;
  type: 'primary' | 'ghost' | 'link' | 'dashed';
  children: React.ReactNode | string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: any) => void;
  size?: 'normal' | 'small';
}

function Button(props: IProps, buttonRef: any) {
  const { type, children, className = '', style, onClick, disabled, size = 'normal' } = props;

  // eslint-disable-next-line
  if (!buttonRef) buttonRef = useRef<any>(null);

  useLayoutEffect(() => {
    if (type === 'link') return;

    function handle(event: any) {
      const target = event.currentTarget;
      target?.classList.add('click');
      setTimeout(() => {
        target?.classList.remove('click');
      }, 300);
    }
    const handleClick = throttle(handle, 300, true);

    buttonRef?.current?.addEventListener('mouseup', handleClick, false);
    return () => {
      buttonRef?.current?.removeEventListener('mouseup', handleClick, false);
    };
  }, []);

  return (
    <button
      className={cn('ait-button', {
        [type]: true,
        [className]: !!className,
        small: size === 'small',
      })}
      style={style}
      onClick={onClick}
      disabled={disabled}
      ref={buttonRef}
    >
      {children}
    </button>
  );
}

export default forwardRef(Button);
