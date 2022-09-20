import React, { memo, useMemo } from 'react';
import Popover from '@/components/Popover';
import Icon from '@/components/Icon';
import Button from '@/components/Button';
import './index.less';

interface PopconfirmProps {
  children: React.ReactElement;
  title: React.ReactNode | string;
  icon?: string;
  iconStyle?: React.CSSProperties;
  okText?: string;
  cancelText?: string;
  placement?: 'top' | 'topLeft' | 'topRight';
  onConfirm?: (event: any) => void;
  onCancel?: (event: any) => void;
}

function Popconfirm(props: PopconfirmProps) {
  const {
    children,
    title,
    icon = 'warn',
    iconStyle,
    okText = '确定',
    cancelText = '取消',
    onConfirm,
    onCancel,
    placement,
  } = props;

  const renderContent = useMemo(
    () => (
      <div className="ait-popconfirm">
        <div className="ait-popconfirm-header">
          <div className="ait-popconfirm-icon">
            <Icon name={icon} style={iconStyle} />
          </div>
          <span>{title}</span>
        </div>
        <div className="ait-popconfirm-foot">
          <Button type="ghost" size="small" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button type="primary" size="small" style={{ marginLeft: 10 }} onClick={onConfirm}>
            {okText}
          </Button>
        </div>
      </div>
    ),
    [title],
  );

  return (
    <Popover content={renderContent} placement={placement}>
      {children}
    </Popover>
  );
}

export default memo(Popconfirm);
