import React, { memo, useLayoutEffect } from 'react';
import classnames from 'classnames';
import Portal from '@/components/Portal';
import Icon from '@/components/Icon';
import Button from '@/components/Button';
import useReducer from '@/utils/useReducer';
import { getViewPortWidth, hasContainsTargetNode } from '@/utils';
import './index.less';

const initialState = {
  offsetX: 0,
  offsetY: 0,
  isClosed: true,
};

export interface ModalProps {
  // 隐藏、显示模态框
  visible: boolean;
  // 模态框在 Z 轴的层叠境界
  zIndex?: number;
  // 是否展示遮罩层
  mask?: boolean;
  // 点击遮罩层是否可以关闭模态框
  maskClosable?: boolean;
  // 定义模态框的宽度。默认 520
  width?: number;
  // 是否展示模态框底部内容
  foot?: boolean;
  // 是否展示取消按钮
  showCancel?: boolean;
  // 是否展示确认按钮
  showOk?: boolean;
  // 取消按钮文本
  cancelText?: string;
  // 确认按钮文本
  okText?: string;
  // 取消事件
  onCancel?: () => void;
  // 确定事件
  onOk?: () => void;
  // 模态框关闭后的回调函数
  onClosed?: () => void;
  // 需要渲染的字节点
  children: React.ReactNode | string;
  // 模态框的标题
  title?: React.ReactNode | string;
  // 是否显示关闭按钮（右上角的 x 按钮）
  closable?: boolean;
  // 定义 ait-modal-body 节点样式
  style?: React.CSSProperties;
  // 模态框关闭时是否销毁 children
  destroyOnClose?: boolean;
}

function Modal(props: ModalProps) {
  const [state, setState] = useReducer(initialState);
  const {
    visible,
    onCancel,
    onOk,
    zIndex,
    mask = true,
    maskClosable = true,
    width = 520,
    foot = true,
    children,
    showCancel = true,
    cancelText = '取消',
    showOk = true,
    okText = '确定',
    title,
    closable = true,
    style,
    destroyOnClose,
    onClosed,
  } = props;

  useLayoutEffect(() => {
    const SW = getViewPortWidth();
    function handle(event: any) {
      // 将 ait-modal-root 节点区域内的点击忽略。
      if (!hasContainsTargetNode('ait-modal-root', event.target)) return;

      // 计算鼠标点击时，距离屏幕左上角的偏移量。
      const { clientX, clientY } = event;
      // 计算模态框左上角，距离 clientX, clientY 的偏移量。
      const offsetX = clientX - (SW - width) / 2;
      const offsetY = clientY - 100;
      setState({ offsetX, offsetY });
    }

    window.addEventListener('click', handle, false);

    // 组件卸载时，将监听事件移除。
    return () => {
      window.removeEventListener('click', handle, false);
    };
  }, []);

  useLayoutEffect(() => {
    // 每当模态框展示的时候，我们将 body 节点添加 overflow: hidden 属性，
    // 避免模态框内部的内容滑动时，页面内容也跟着滑动。
    if (visible) {
      document.body.style.overflow = 'hidden';
      setState({ isClosed: false });
    } else {
      document.body.style.overflow = '';
      setTimeout(() => {
        setState({ isClosed: true });
        onClosed?.();
      }, 300);
    }
  }, [visible, onClosed]);

  // 点击模态框，并关闭模态框。
  // 当事件触发对象是 ait-modal-wrap 节点，并且 maskClosable === true，才可以关闭模态框
  const handleClickModalWrap = (event: any) => {
    if (event.target.classList.contains('ait-modal-wrap') && maskClosable && onCancel) {
      event.stopPropagation();
      onCancel();
    }
  };

  return (
    <Portal containerClassName="ait-modal-root">
      <>
        {
          // 背景遮罩层
          mask && <div className={classnames('ait-modal-mask', { show: visible })} style={{ zIndex }} />
        }
        <div
          className={classnames('ait-modal-wrap', {
            show: visible,
          })}
          onClickCapture={handleClickModalWrap}
          style={{ zIndex }}
        >
          <div
            className={classnames('ait-modal', { show: visible })}
            style={{
              width,
              // 通过 transfrom-origin 属性，模态框在展示时由触发点位置弹出，隐藏时再回到触发点位置。
              transformOrigin: `${state.offsetX}px ${state.offsetY}px`,
            }}
          >
            {closable ? (
              <button className="ait-modal-close-button">
                <Icon name="close" className="ait-modal-close-button-icon" onClick={onCancel} />
              </button>
            ) : null}
            {title && <div className="ait-modal-header">{title}</div>}
            <div className="ait-modal-body" style={style}>
              {destroyOnClose && state.isClosed ? null : children}
            </div>
            {foot ? (
              <div className="ait-modal-foot">
                {showCancel && (
                  <Button type="ghost" className="ait-modal-foot-button" onClick={onCancel}>
                    {cancelText}
                  </Button>
                )}
                {showOk && (
                  <Button type="primary" className="ait-modal-foot-button" onClick={onOk}>
                    {okText}
                  </Button>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </>
    </Portal>
  );
}

export default memo(Modal);
