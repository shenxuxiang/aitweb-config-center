import React, { memo, useLayoutEffect, useRef } from 'react';
import Portal from '@/components/Portal';
import { getCssPropertyValue, throttle } from '@/utils';
import './index.less';
import useReducer from '@/utils/useReducer';
import cn from 'classnames';

const initialState = {
  showPopover: false,
};

interface PopoverProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: 'top' | 'topLeft' | 'topRight';
  trigger?: 'click' | 'hover';
  style?: React.CSSProperties;
  disabled?: boolean;
}

function Popover(props: PopoverProps) {
  const { content, children, placement = 'top', trigger = 'click', style, disabled } = props;
  const [state, setState] = useReducer(initialState);
  const { showPopover } = state;
  const contentRef = useRef<any>(null);
  const popoverRef = useRef<any>(null);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content || disabled) return;
    content.tabIndex = -1;

    let isFirst = true;
    function handleFocus() {
      if (popoverRef.current?.style.display === 'block') {
        handleBlur();
        return;
      }

      if (popoverRef.current) popoverRef.current.style.display = 'block';
      setTimeout(() => {
        if (isFirst) {
          isFirst = false;
          let { offsetLeft } = content;
          let { offsetTop } = content;
          let { offsetParent } = content;
          while (offsetParent) {
            offsetLeft += offsetParent.offsetLeft + parseInt(getCssPropertyValue(offsetParent, 'border-left-width'));
            offsetTop += offsetParent.offsetTop + parseInt(getCssPropertyValue(offsetParent, 'border-top-width'));
            offsetParent = offsetParent.offsetParent;
          }
          const contentWidth = content.offsetWidth;

          const popoverWidth = popoverRef.current?.offsetWidth | 0;
          const popoverHeight = popoverRef.current?.offsetHeight | 0;
          let cssText = 'display: block;';
          cssText += `top: ${offsetTop - popoverHeight - 15}px;`;
          if (placement === 'top') {
            cssText += `left: ${offsetLeft - popoverWidth / 2 + contentWidth / 2}px;`;
          } else if (placement === 'topLeft') {
            cssText += `left: ${offsetLeft}px;`;
          } else if (placement === 'topRight') {
            cssText += `left: ${offsetLeft - popoverWidth + contentWidth}px;`;
          }
          if (popoverRef.current) popoverRef.current.style.cssText = cssText;
        }
        setState({ showPopover: true });
      }, 20);
    }

    function handleBlur() {
      setState({ showPopover: false });
      setTimeout(() => {
        if (popoverRef.current) popoverRef.current.style.display = 'none';
      }, 300);
    }

    const onClick = throttle(handleFocus, 300, true);
    const focusEventName = trigger === 'click' ? 'click' : 'mouseenter';
    const blurEventName = trigger === 'click' ? 'blur' : 'mouseleave';

    content.addEventListener(focusEventName, onClick, false);
    content.addEventListener(blurEventName, handleBlur, false);
    return () => {
      content.removeEventListener(focusEventName, onClick, false);
      content.removeEventListener(blurEventName, handleBlur, false);
    };
  }, [disabled]);

  return (
    <>
      {React.cloneElement(children, { ref: contentRef })}
      <Portal>
        <div className="ait-popover-x">
          <div
            className={cn('ait-popover', {
              show: showPopover,
              'top-left': placement === 'topLeft',
              'top-right': placement === 'topRight',
            })}
            ref={popoverRef}
          >
            <div className="ait-popover-arrow" />
            <div className="ait-popover-body" style={style}>
              {content}
            </div>
          </div>
        </div>
      </Portal>
    </>
  );
}

export default memo(Popover);
