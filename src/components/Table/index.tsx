import React, { memo, useMemo } from 'react';
import Spin from '@/components/Spin';
import Empty from '@/components/Empty';
import { isEmpty } from '@/utils';
import styles from './index.module.less';

interface IColumnItem {
  dataIndex: string;
  title: string;
  width?: number | string;
  align?: 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | 'match-parent';
  render?: (value: any, record: any, index: number) => React.ReactNode | string;
}

interface IProps {
  columns: IColumnItem[];
  dataSource: any[];
  rowKey: string;
  bordered?: boolean;
  scroll?: {
    x?: number;
    y?: number;
  };
  loading?: boolean;
  style?: React.CSSProperties;
}

function Table(props: IProps) {
  const { columns, dataSource, rowKey, bordered, scroll, loading = false, style = {} } = props;
  const renderCols = useMemo(
    () =>
      columns.map((item) => {
        if (item.width) {
          return (
            <col
              key={item.dataIndex}
              style={{
                width: typeof item.width === 'number' ? `${item.width}px` : `${item.width}`,
                minWidth: typeof item.width === 'number' ? `${item.width}px` : `${item.width}`,
              }}
            />
          );
        }
        return <col key={item.dataIndex} />;
      }),
    [columns],
  );

  const renderHead = useMemo(
    () => (
      <tr>
        {columns.map((item) => (
          <th
            key={item.dataIndex}
            style={{
              textAlign: item.align ? item.align : 'left',
              borderRight: bordered ? '1px solid #e8e8e8' : 'none',
            }}
          >
            {item.title}
          </th>
        ))}
      </tr>
    ),
    [columns],
  );

  const renderBody = useMemo(
    () =>
      dataSource.map((item, index) => (
        <tr key={item[rowKey]}>
          {columns.map((subitem) => (
            <td
              key={subitem.dataIndex}
              style={{
                textAlign: subitem.align ? subitem.align : 'left',
                borderRight: bordered ? '1px solid #e8e8e8' : 'none',
              }}
            >
              {typeof subitem.render === 'function'
                ? subitem.render(item[subitem.dataIndex], item, index)
                : item[subitem.dataIndex]}
            </td>
          ))}
        </tr>
      )),
    [columns, dataSource],
  );

  const renderEmpty = useMemo(() => {
    if (isEmpty(dataSource)) {
      return <Empty description="暂无数据" className={bordered ? styles.table_empty_bordered : styles.table_empty} />;
    }
    return null;
  }, [dataSource, bordered]);

  // scroll.y 表示在 y 方向上的高度。此时高度是有限的，需要通过容器滚动的形式展示。
  if (scroll?.y) {
    return (
      <Spin spinning={loading}>
        <div className={styles.ait_table} style={{ ...style, width: scroll?.x }}>
          <table className={`${styles.table_head}${bordered ? ` ${styles.bordered}` : ''}`}>
            <colgroup>{renderCols}</colgroup>
            <thead>{renderHead}</thead>
          </table>
          <div className={styles.scroll_box} style={{ height: scroll.y }}>
            <table className={`${styles.table_body}${bordered ? ` ${styles.bordered}` : ''}`}>
              <colgroup>{renderCols}</colgroup>
              <tbody>{renderBody}</tbody>
            </table>
            {renderEmpty}
          </div>
        </div>
      </Spin>
    );
  }
  // 此时表格是完全展示的。不需要容器滚动。
  return (
    <Spin spinning={loading}>
      <div className={styles.ait_table} style={{ ...style, width: scroll?.x }}>
        <table className={`${styles.table}${bordered ? ` ${styles.bordered}` : ''}`}>
          <colgroup>{renderCols}</colgroup>
          <thead>{renderHead}</thead>
          <tbody>{renderBody}</tbody>
        </table>
        {renderEmpty}
      </div>
    </Spin>
  );
}

export default memo(Table);
