import React, { memo, useContext } from 'react';
import cn from 'classnames';
import { CheckboxContext } from './CheckboxGroup';
import './index.less';

export interface CheckboxProps {
  value: string;
  children: React.ReactNode;
}

function Checkbox(props: CheckboxProps) {
  const { value, children } = props;
  const { currentValue, onChangeValue, disabled, name } = useContext(CheckboxContext);

  return (
    <label
      className={cn('ait-checkbox-item', {
        'ait-checkbox-item-checked': currentValue?.includes(value),
        disabled,
      })}
    >
      <span className="ait-checkbox">
        <input
          type="checkbox"
          value={value}
          name={name}
          className="ait-checkbox-input"
          disabled={disabled}
          onChange={onChangeValue}
          // checkbox 的 checked 属性不会实时更新
          // 所以不可以根据 [checked] 伪类选择器来设置样式
          // checked={currentValue?.includes(value)}
        />
        <span className="ait-checkbox-inner" />
      </span>
      <span className="ait-checkbox-text">{children}</span>
    </label>
  );
}

export default memo(Checkbox);
