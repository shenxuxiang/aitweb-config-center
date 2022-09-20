import React, { memo, useCallback, useEffect, useRef, useLayoutEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import useReducer from '@/utils/useReducer';
import styles from './index.module.less';

interface INavigateItem {
  title: string;
  path: string;
}

interface IProps {
  // 导航列表
  navagateList: INavigateItem[];
  // 导航的宽度
  width?: number;
  // 导航自定义样式
  style?: React.CSSProperties;
  // 导航指针的样式
  indicatorStyle?: React.CSSProperties;
}

const initialState = {
  // 当前指针
  indicator: 0,
  // 记录每个导航按钮的偏移量
  offsets: [] as number[],
  // 记录导航按钮的宽度
  widths: [] as number[],
};

function Navigation(props: IProps) {
  const [state, setState] = useReducer(initialState);
  const { navagateList, width, style, indicatorStyle } = props;
  const navRef = useRef<any>(null);
  const location = useLocation();

  // NavLink 组件的 className 处理。
  const handleClassName = useCallback((props: any): string => {
    const { isActive } = props;
    let className = styles.navigation_link;
    if (isActive) className += ` ${styles.active}`;
    return className;
  }, []);

  useLayoutEffect(() => {
    // 通过 location.pathname 计算出当前路径属于哪个页面。最终得出导航指针。
    const { pathname } = location;
    const indicator = navagateList.findIndex((item) => pathname.startsWith(item.path)) | 0;
    setState({ indicator });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    if (navRef.current == null) return;
    // 计算出每个导航按钮的宽度、偏移量
    const { children } = navRef.current;
    const offsets: number[] = [];
    const widths: number[] = [];
    for (let i = 0; i < children.length - 1; i++) {
      const item = children[i];
      offsets.push(item.offsetLeft);
      widths.push(item.offsetWidth);
    }
    setState({ offsets, widths });
  }, []);

  // 点击导航按钮时，更新 indicator。
  const handleClick = useCallback((event: any) => {
    if (!event.target.matches(`a.${styles.navigation_link}`)) return;
    const indicator = event.target.getAttribute('data-indicator');
    setState(() => ({ indicator }));
  }, []);

  return (
    <div className={styles.navigation} onClick={handleClick} ref={navRef} style={{ ...style, width }}>
      {navagateList.map((item: any, index: number) => (
        <NavLink to={item.path} className={handleClassName} data-indicator={index} key={index}>
          {item.title}
        </NavLink>
      ))}
      <div
        className={styles.indicator}
        style={{
          ...indicatorStyle,
          transform: `translateX(${state.offsets[state.indicator]}px)`,
          width: state.widths[state.indicator],
        }}
      />
    </div>
  );
}

export default memo(Navigation);
