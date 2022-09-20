import React, { memo, useCallback, useMemo, useState, useEffect, useRef } from 'react';
import './index.less';

export interface CheckboxContext {
  currentValue?: string[];
  onChangeValue?: (event: any) => void;
  disabled?: boolean;
  name?: string;
}
// eslint-disable-next-line
export const CheckboxContext = React.createContext({} as CheckboxContext);
export interface CheckboxGroupProps {
  value?: string[];
  disabled?: boolean;
  name?: string;
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  children: React.ReactNode;
  direction: 'vertical' | 'horizontal';
}

function CheckboxGroup(props: CheckboxGroupProps) {
  const { value, disabled, name, defaultValue = [], onChange, children, direction = 'horizontal' } = props;
  const [currentValue, setCurrentValue] = useState(defaultValue);
  // 是否为组件内部修改了 currentValue 的值。
  const hasInnerModifyRef = useRef(false);

  useEffect(() => {
    // 如果是组件内容修改了 currentValue 的值，并通过 onChange 事件修改了 props.value。
    // 则不执行 setState() 函数。
    if (hasInnerModifyRef.current) {
      hasInnerModifyRef.current = false;
      return;
    }
    setCurrentValue(() => (typeof value === 'undefined' ? defaultValue : value));
  }, [value]);

  const onChangeValue = useCallback(
    (event: any) => {
      const { value } = event.target;
      let nextValue: string[];
      if (currentValue.includes(value)) {
        nextValue = currentValue.filter((item) => item !== value);
      } else {
        nextValue = [...currentValue, value];
      }
      hasInnerModifyRef.current = true;
      setCurrentValue(() => nextValue);
      onChange?.(nextValue);
    },
    [currentValue, onChange],
  );

  const context = useMemo(
    () => ({
      currentValue,
      onChangeValue,
      disabled,
      name,
    }),
    [currentValue, onChangeValue],
  );

  return (
    <div className={`ait-checkbox-group ${direction}`}>
      <CheckboxContext.Provider value={context}>{children}</CheckboxContext.Provider>
    </div>
  );
}

export default memo(CheckboxGroup);
