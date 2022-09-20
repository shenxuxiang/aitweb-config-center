import React, { memo, useState, useLayoutEffect, useRef, useEffect } from 'react';
import cn from 'classnames';
import { throttle } from '@/utils';
import './index.less';

interface SwitchProps {
  value: boolean;
  defaultValue?: boolean;
  checkedChildren?: string;
  unCheckedChildren?: string;
  disabled?: boolean;
  onChange: (value: boolean) => void;
  style?: React.CSSProperties;
}

function Switch(props: SwitchProps) {
  const { value, checkedChildren, unCheckedChildren, disabled, onChange, style } = props;
  const [state, setState] = useState(value);
  const [animating, setAnimating] = useState(false);
  const switchRef = useRef<any>(null);
  const hasInnerModify = useRef(false);

  useEffect(() => {
    if (hasInnerModify.current) {
      hasInnerModify.current = false;
      return;
    }
    setState(() => value);
  }, [value]);

  useLayoutEffect(() => {
    function handle(event: any) {
      const target = event.currentTarget;
      const checked = target.className.includes('ait-switch-checked') ?? false;
      setState((oldValue) => !oldValue);
      hasInnerModify.current = true;
      onChange?.(checked);
      setAnimating(() => true);

      setTimeout(() => {
        setAnimating(() => false);
      }, 300);
    }

    const handleClick = throttle(handle, 300, true);
    switchRef.current?.addEventListener('mouseup', handleClick, false);
    return () => {
      switchRef.current?.removeEventListener('mouseup', handleClick, false);
    };
  }, []);

  return (
    <button
      className={cn('ait-switch', {
        'ait-switch-checked': state,
        'ait-switch-animating': animating,
      })}
      style={style}
      disabled={disabled}
      ref={switchRef}
    >
      <span className="ait-switch-inner">{state ? checkedChildren : unCheckedChildren}</span>
    </button>
  );
}

export default memo(Switch);
