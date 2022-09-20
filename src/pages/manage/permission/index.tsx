import React, { useCallback, useEffect } from 'react';
import styles from './index.module.less';
import dataSource from './data';
import VirtualList from '@/components/VirtualList';
import useReducer from '@/utils/useReducer';
import Image from '@/components/Image';

const initialState = {
  pageNum: 1,
  pageSize: 30,
  loading: false,
  hasMore: true,
  sourceList: [],
};

const queryDataSource = ({ pageSize, pageNum }: any) =>
  new Promise((resolve) => {
    console.log(pageSize, pageNum);
    const start = pageSize * (pageNum - 1);
    const end = pageSize * pageNum;
    const data = dataSource.slice(start, end);
    setTimeout(() => resolve(data), 500);
  });

export default function Record() {
  const [state, setState] = useReducer(initialState);
  const { pageNum, pageSize, loading, sourceList, hasMore } = state;

  useEffect(() => {
    setState({ loading: true });
    queryDataSource({ pageNum, pageSize }).then((data: any) => {
      setState({ loading: false, sourceList: data });
    });
  }, []);

  const handleLoad = useCallback(() => {
    setState({ loading: true });
    queryDataSource({ pageNum: pageNum + 1, pageSize }).then((data: any) => {
      setState((prevState) => ({
        loading: false,
        pageNum: pageNum + 1,
        sourceList: prevState.sourceList.concat(data),
        hasMore: data.length > 0,
      }));
    });
  }, [pageNum, pageSize]);

  return (
    <div className={styles.page}>
      <VirtualList
        dataSource={sourceList}
        buffer={5}
        onReachBottom={handleLoad}
        loading={loading}
        hasMore={hasMore}
        renderItem={function (item) {
          return (
            <div className={styles.virtual_list_item_x} key={item.id}>
              <div className={styles.virtual_list_item}>
                <Image src={item.avatar} alt="" className={styles.virtual_list_item_avatar} />
                <span className={styles.virtual_list_item_info}>{item.message}</span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
