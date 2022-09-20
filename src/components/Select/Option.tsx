import React, { memo, useContext } from 'react';
import classnames from 'classnames';
import { SelectContext } from './Select';
import './index.less';

export interface OptionProps {
  value: string;
  title?: string;
  children?: React.ReactNode | string;
}

function SelectOption(props: OptionProps) {
  const { value, title, children } = props;
  const context = useContext(SelectContext);

  const handleClick = (event: any) => {
    event.stopPropagation();
    context.onChange(value, typeof title === 'string' ? title : (children as any));
  };

  return (
    <li
      className={classnames('ait-select-dropdown-item', {
        active: value === context.currentValue,
      })}
      onClick={handleClick}
    >
      {children || title}
    </li>
  );
}

export default memo(SelectOption);
