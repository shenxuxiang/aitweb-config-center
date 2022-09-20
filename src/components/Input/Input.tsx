import React, { memo, useLayoutEffect, useRef } from 'react';
import classnames from 'classnames';
import useReducer from '@/utils/useReducer';
import './index.less';

type InputType = 'text' | 'number' | 'Number' | 'password';
export interface InputProps {
  type?: InputType;
  suffix?: React.ReactNode | string;
  prefix?: React.ReactNode | string;
  className?: string;
  width?: number;
  style?: React.CSSProperties;
  value?: string;
  defaultValue?: string;
  name?: string;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  onChange?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
  onCompositionStart?: (event: any) => void;
  onCompositionUpdate?: (event: any) => void;
  onCompositionEnd?: (event: any) => void;
  rules?: Array<{ message: string; pattern: RegExp | ((input: string) => boolean) }>;
}
const initialState = {
  currentValue: '',
  errMsg: '',
};
function Input(props: InputProps) {
  const {
    style,
    className = '',
    prefix,
    suffix,
    type = 'text',
    name,
    value,
    width,
    defaultValue,
    disabled,
    placeholder,
    maxLength,
    onChange,
    onKeyDown,
    onKeyUp,
    onCompositionStart,
    onCompositionUpdate,
    onCompositionEnd,
    rules = [],
  } = props;
  const [state, setState] = useReducer(initialState);

  const hasInnerModify = useRef(false);

  useLayoutEffect(() => {
    if (hasInnerModify.current) {
      hasInnerModify.current = false;
      return;
    }
    setState({ currentValue: value });
  }, [value]);

  useLayoutEffect(() => {
    if (typeof value === 'undefined' && defaultValue) {
      setState({ currentValue: defaultValue });
    }
  }, []);

  const handleInputChange = (event: any) => {
    const { value } = event.target;
    let errMsg = '';
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      if (typeof rule.pattern === 'function') {
        if (!rule.pattern(value)) {
          errMsg = rule.message;
          break;
        }
      } else if (!rule.pattern.test(value)) {
        errMsg = rule.message;
        break;
      }
    }
    setState({ currentValue: value, errMsg });
    onChange?.(event);
  };

  return (
    <div
      className={classnames('ait-input-x', {
        [className]: !!className,
      })}
      tabIndex={prefix || suffix ? -1 : undefined}
      style={{ width, ...style }}
    >
      {!prefix && !suffix ? (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className={classnames('ait-input', {
            error: !!state.errMsg,
          })}
          value={state.currentValue}
          disabled={disabled}
          maxLength={maxLength}
          onInput={handleInputChange}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onCompositionStart={onCompositionStart}
          onCompositionUpdate={onCompositionUpdate}
          onCompositionEnd={onCompositionEnd}
        />
      ) : (
        <div
          className={classnames('ait-input-affix', {
            disabled,
          })}
        >
          {prefix && <div className={classnames('ait-input-prefix', { disabled })}>{prefix}</div>}
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            className="ait-input"
            value={value || ''}
            disabled={disabled}
            maxLength={maxLength}
            onInput={handleInputChange}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            onCompositionStart={onCompositionStart}
            onCompositionUpdate={onCompositionUpdate}
            onCompositionEnd={onCompositionEnd}
          />
          {suffix && <div className={classnames('ait-input-suffix', { disabled })}>{suffix}</div>}
        </div>
      )}
      {state.errMsg ? <div className="ait-input-error-message">{state.errMsg}</div> : null}
    </div>
  );
}

export default memo(Input);
