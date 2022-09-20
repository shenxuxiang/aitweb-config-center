import React, { memo, useState, useMemo, useCallback, useEffect, useRef } from 'react';
import './index.less';

export const RadioContext = React.createContext<any>({});

export interface RadioGroupProps {
  defaultValue?: string;
  value?: string;
  name?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
  direction?: 'vertical' | 'horizontal';
  children: React.ReactNode;
}

function RadioGroup(props: RadioGroupProps) {
  const { defaultValue, value, name, disabled, children, onChange, style, direction = 'horizontal' } = props;
  const [currentValue, setCurrentValue] = useState(defaultValue);
  const hasInnerModifyRef = useRef(false);

  useEffect(() => {
    if (hasInnerModifyRef.current) {
      hasInnerModifyRef.current = false;
      return;
    }
    setCurrentValue(() => (typeof value === 'undefined' ? defaultValue : value));
  }, [value]);

  const onChangeValue = useCallback(
    (event: any) => {
      const { value } = event.target;
      hasInnerModifyRef.current = true;
      setCurrentValue(() => value);
      onChange?.(value);
    },
    [onChange],
  );

  const context = useMemo(
    () => ({
      currentValue,
      onChangeValue,
      name,
      disabled,
    }),
    [currentValue, onChangeValue],
  );

  return (
    <div className={`ait-radio-group ${direction}`} style={style}>
      <RadioContext.Provider value={context}>{children}</RadioContext.Provider>
    </div>
  );
}

export default memo(RadioGroup);
