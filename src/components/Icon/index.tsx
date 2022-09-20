import React, { forwardRef } from 'react';

interface IProps {
  name: string;
  style?: React.CSSProperties;
  className?: string;
  onClick?: (event: any) => any;
}

function Icon(props: IProps, ref: any) {
  const { name, style, className, onClick } = props;

  return (
    <i
      className={`iconfont icon-${name}${className ? ` ${className}` : ''}`}
      style={style}
      onClick={onClick}
      ref={ref}
    />
  );
}

export default forwardRef(Icon);
