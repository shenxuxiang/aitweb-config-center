import React, { memo, useRef, useLayoutEffect, useMemo } from 'react';
import classnames from 'classnames';
import Icon from '@/components/Icon';
import Portal from '@/components/Portal';
import useReducer from '@/utils/useReducer';
import { getCssPropertyValue } from '@/utils';
import './index.less';

const initialState = {
  // 下拉选项展示的内容
  title: '',
  // 当前的下拉选项
  currentValue: '',
  // 查询条件
  filterString: '',
  // 是否获取了焦点
  hasFocus: false,
  // 是否展示下拉框
  showDropdown: false,
  // 下拉框的样式
  dropdownStyle: undefined as React.CSSProperties | undefined,
};

export interface SelectProps {
  children?: React.ReactNode | string[];
  className?: string;
  style?: React.CSSProperties;
  dropdownClassName?: string;
  dropdownStyle?: React.CSSProperties;
  filterOption?: (input: string, option: any) => boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export interface SelectContext {
  currentValue: string | number;
  onChange: (value: string, title: string) => void;
}
// eslint-disable-next-line
export const SelectContext = React.createContext({} as SelectContext);

function Select(props: SelectProps) {
  const {
    dropdownClassName,
    dropdownStyle,
    className,
    style,
    filterOption,
    value,
    defaultValue,
    children,
    placeholder,
    disabled,
  } = props;
  const [state, setState] = useReducer(initialState);
  const { title, filterString, hasFocus, showDropdown, currentValue } = state;
  const selectRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const dropdownRef = useRef<any>(null);
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

  useLayoutEffect(() => {
    let title = '';
    React.Children.forEach(children, (child: any) => {
      if (child.props.value === currentValue) {
        title = child.props.title || child.props.children;
      }
    });

    setState((prevState) => {
      if (title === prevState.title) return null;
      return { title };
    });
  }, [children, currentValue]);
  // 得到焦点时
  function handleFocus() {
    if (dropdownRef.current.style.display === 'block') return;
    // 手动给 input 元素获取焦点
    if (inputRef.current) inputRef.current.focus();
    // 将下拉框 display 设置为 block。这样 transition 动效才能正常显示。
    dropdownRef.current.style.display = 'block';
    setTimeout(() => setState(() => ({ showDropdown: true, hasFocus: true })), 20);
  }

  // 失去焦点时
  function handleBlur() {
    if (dropdownRef.current.style.display === 'none') return;

    setState(() => ({ hasFocus: false, showDropdown: false }));
    // 下拉框隐藏后，将 Select 组件的状态初始化
    setTimeout(() => {
      if (inputRef.current) inputRef.current.style.background = 'rgba(255, 255, 255, 0)';
      dropdownRef.current.style.display = 'none';
      setState((prevState) => {
        if (prevState.filterString === '') return null;
        return { filterString: '' };
      });
    }, 300);
  }

  const handleInputChange = (event: any) => {
    const { value } = event.target;
    setState({ filterString: value });
    inputRef.current.style.background = value ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)';
  };

  // 元素挂载成功以后添加样式。
  useLayoutEffect(() => {
    let { offsetLeft } = selectRef.current;
    let { offsetTop } = selectRef.current;
    const height = selectRef.current.offsetHeight;
    const width = selectRef.current.offsetWidth;
    let { offsetParent } = selectRef.current;

    while (offsetParent) {
      offsetLeft += offsetParent.offsetLeft + parseInt(getCssPropertyValue(offsetParent, 'border-left-width'));
      offsetTop += offsetParent.offsetTop + parseInt(getCssPropertyValue(offsetParent, 'border-top-width'));
      offsetParent = offsetParent.offsetParent;
    }

    let style = {
      top: offsetTop + height + 5,
      left: offsetLeft,
      width,
      display: 'none',
    };
    if (dropdownStyle) style = { ...style, ...dropdownStyle };

    setState({ dropdownStyle: style });
  }, [dropdownStyle]);

  // 上下文内容
  const contextValue = useMemo(() => {
    // 修改值，并隐藏 dropdown 弹框
    const onChange = (value: string, title: string) => {
      hasInnerModify.current = true;
      // 使 Select 组件失去焦点，并隐藏下拉弹框。
      setState({
        currentValue: value,
        title,
        hasFocus: false,
        showDropdown: false,
      });
      // 将变更后的值，向上传递。
      props.onChange?.(value);
      // 下拉框隐藏后，将 Select 组件的状态初始化
      setTimeout(() => {
        dropdownRef.current.style.display = 'none';
        if (inputRef.current) inputRef.current.style.background = 'rgba(255, 255, 255, 0)';
        setState((prevState) => {
          if (prevState.filterString === '') return null;
          return { filterString: '' };
        });
      }, 300);
    };

    return { onChange, currentValue };
  }, [props.onChange]);

  return (
    <>
      <div
        className={classnames('ait-select', {
          className: !!className,
          focus: hasFocus,
          disabled,
        })}
        style={style}
        ref={selectRef}
        tabIndex={-1}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <span className="ait-select-placeholder">{placeholder}</span>
        <span className="ait-select-title">{title}</span>
        <Icon name="arrow-down" className="ait-select-icon" />
        {typeof filterOption === 'function' ? (
          <input
            type="text"
            className="ait-select-input"
            ref={inputRef}
            value={filterString}
            onInput={handleInputChange}
          />
        ) : null}
      </div>
      <Portal>
        <div className="ait-select-dropdown-x">
          <ul
            className={classnames('ait-select-dropdown', {
              dropdownClassName: !!dropdownClassName,
              show: showDropdown,
            })}
            style={state.dropdownStyle}
            ref={dropdownRef}
          >
            <SelectContext.Provider value={contextValue}>
              {React.Children.map(props.children, (child) => {
                if (typeof filterOption === 'function') {
                  if (filterOption(filterString, child)) {
                    return child;
                  }
                  return null;
                }
                return child;
              })}
            </SelectContext.Provider>
          </ul>
        </div>
      </Portal>
    </>
  );
}

export default memo(Select);
