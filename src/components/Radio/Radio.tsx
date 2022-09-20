import React, { memo, useContext } from 'react';
import cn from 'classnames';
import { RadioContext } from './RadioGroup';
import './index.less';

export interface RadioProps {
  value: string;
  children: React.ReactNode | string;
  style?: React.CSSProperties;
}

function Radio(props: RadioProps) {
  const { disabled, name, currentValue, onChangeValue } = useContext(RadioContext);
  const { value, children, style } = props;
  return (
    <label
      className={cn('ait-radio-item', {
        'ait-radio-item-checked': value === currentValue,
        disabled,
      })}
      style={style}
    >
      <span className="ait-radio">
        <input
          type="radio"
          name={name}
          disabled={disabled}
          checked={value === currentValue}
          value={value}
          className="ait-radio-input"
          onChange={onChangeValue}
        />
        <span className="ait-radio-inner" />
      </span>
      <span className="ait-radio-text">{children}</span>
    </label>
  );
}

export default memo(Radio);
