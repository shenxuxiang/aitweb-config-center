import React, { memo, useEffect, useRef } from 'react';
import useReducer from '@/utils/useReducer';
import { getViewPortHeight, getScrollTop, getScrollHeight, throttle } from '@/utils';
import './index.less';

// 距离底部缓冲区
const REACH_BOTTOM_BUFFER = 100;
// 节流延迟时间
const THROTTLE_DELAY = 100;

interface VirtualListProps {
  // 展示的数据列表
  dataSource: any[];
  // 列表项渲染函数
  renderItem: (data: any, index: number) => React.ReactNode | string;
  // 样式定义
  style?: React.CSSProperties;
  // 添加类名
  className?: string;
  // 容器的高度。如果添加了容器高度，那么就会在这个容器内部进行滚动
  height?: number;
  // 缓冲
  buffer: number;
  // 每一行渲染几列
  col?: number;
  // 滚动到容器底部行为
  onReachBottom?: () => void;
  // 数据加载中
  loading?: boolean;
  // 更多数据
  hasMore?: boolean;
  // 是否展示底部的 loading
  showLoading?: boolean;
}

const initialState = {
  start: 0,
  end: 10,
  offsetTop: 0,
  totalHeight: 9999,
};

function VirtualList(props: VirtualListProps) {
  const {
    dataSource,
    renderItem,
    height,
    buffer,
    onReachBottom,
    col = 1,
    className,
    style = {},
    loading = false,
    hasMore = true,
    showLoading = true,
  } = props;
  const [state, setState] = useReducer(initialState);
  const containerRef = useRef<any>(null);
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    if (loading === false) {
      // 做一个延迟处理。否则在滚动到容器底部时，当网络请求太快时，会多次触发 onReachBottom 行为。
      // eslint-disable-next-line
      setTimeout(() => (loadingRef.current = false), 100);
    }
  }, [loading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    let container: any = null;
    if (typeof height === 'number') {
      container = containerRef.current;
    } else {
      container = window;
    }
    // 数据的长度
    const maxLength = dataSource?.length ?? 0;
    if (dataSource?.length <= 0) return;

    // 获取列表项的高度
    const itemHeight = containerRef.current?.firstElementChild?.firstElementChild?.lastElementChild?.offsetHeight ?? 0;
    // totalHeight 的作用就是将高度撑开。如果高度没有被撑开，在滚动时可能会多次触发触底行为。
    // 目的是为了容器滚动时更加流畅。而且，容器在滚动时不会在没有触底时触发触底行为。
    setState({ totalHeight: Math.ceil(maxLength / col) * itemHeight });
    // 计算容器的高度
    const containerHeight = container === window ? getViewPortHeight() : height;
    // 容器内部可以放置多少个列表项。
    const sum = Math.ceil(containerHeight! / itemHeight) | 0;
    // 记录上一次计算结果
    const storage = { start: 0, end: 0 };

    function handleScroll() {
      const scrollTop = getScrollTop(container) | 0;
      // 通过 scrollTop > 0 来判断发生了滚动。否则不触发触底行为。
      scrollTop > 0 && handleReachBottom(scrollTop);
      // 计算起始位置，起始位置不能为负数。col 表示一行有几列。所以 start 要乘以 col 才算是得到正真的起点位置
      let start = Math.floor(scrollTop / itemHeight) - buffer;
      start = start <= 0 ? 0 : start;
      // 在此处计算 offsetTop 值。因为此时不需要考虑 col 这个因素。
      const offsetTop = start * itemHeight;
      start *= col;

      // 计算终止位置，终止位置不能比数据的长度还要大。
      // buffer + sum + buffer 表示前后需要缓冲区，缓冲区的目的是为了防止滚动时，上下出现空白。
      // (buffer + sum + buffer) * col 表示如果一行有几列，那么就需要乘以 col。
      let end = start + (buffer + sum + buffer) * col;
      end = end >= maxLength ? maxLength : end;

      // 如果当前计算的结果与上一次的结果一致，则不需要更新。
      if (start === storage.start && end === storage.end) return;

      storage.start = start;
      storage.end = end;
      setState({ start, end, offsetTop });
    }

    // 滚动触底行为
    function handleReachBottom(scrollTop: number) {
      // 当 loading 为 true 时，说明此时请求还在进行中，不能重复多次请求。
      // hasMore 为 false 时，表示没有更多数据了。
      if (loadingRef.current || !hasMoreRef.current) return;

      const scrollHeight = getScrollHeight(container);

      if (containerHeight! + scrollTop + REACH_BOTTOM_BUFFER >= scrollHeight) {
        loadingRef.current = true;
        onReachBottom?.();
      }
    }

    // 组件初始化时，需要计算一次。
    handleScroll();
    const onScroll = throttle(handleScroll, THROTTLE_DELAY);
    container?.addEventListener('scroll', onScroll, false);
    // 组件卸载时，将监听事件移除。
    return () => {
      container?.removeEventListener('scroll', onScroll, false);
    };
  }, [dataSource, onReachBottom]);

  return (
    // 第一层 div 是一个容器。他可能被设置 overflow: scroll。
    <div
      className="ait-virtual-list"
      style={{
        height,
        overflow: typeof height === 'number' ? 'auto' : '',
      }}
      ref={containerRef}
    >
      {/* 设置着一层的目的就是为了将容器的高度撑开 */}
      <div style={{ height: state.totalHeight }}>
        {/* 添加类名或者样式，与 renderItem() 渲染的内容配合 */}
        <div style={style} className={className}>
          {/* 占位，用于渲染的列表可以正常的展示在可视区之内 */}
          <div style={{ height: state.offsetTop, width: '100%' }} />
          {dataSource.slice(state.start, state.end).map((item, index) => renderItem(item, index))}
        </div>
      </div>
      {showLoading ? (
        <div className="ait-virtual-list-loading">
          {loading ? '努力加载中•••' : hasMore ? '上拉加载更多数据' : '已经没有更多数据了'}
        </div>
      ) : null}
    </div>
  );
}

export default memo(VirtualList);
