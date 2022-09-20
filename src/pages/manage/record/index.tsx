import React, { memo, useCallback, useLayoutEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Table from '@/components/Table';
import useReducer from '@/utils/useReducer';
import actions from '@/redux/actions/manage-record';
import Button from '@/components/Button';
import Pagination from '@/components/Pagination';
import Input from '@/components/Input';
import styles from './index.module.less';
import Modal from '@/components/Modal';

const mapStateFromProps = (state: any) => state.manageRecord;
const mapDispatchFromProps = (dispatch: Dispatch) => bindActionCreators(actions, dispatch);
const initialState = {
  loading: true,
  dataSource: [] as any[],
  total: 0,
  pageSize: 10,
  pageNum: 1,
  searchCondition: '',
};

function Record(props: any) {
  const [state, setState] = useReducer(initialState);
  const { loading, pageSize, pageNum, searchCondition, total, dataSource } = state;
  const { querySyllabus } = props;

  // 定义表格columns
  const columns = useMemo(
    () => [
      {
        dataIndex: 'course',
        title: '搜索条件',
        width: 150,
      },
      {
        dataIndex: 'title',
        title: '课程名称',
        width: 150,
      },
      {
        dataIndex: 'modules',
        title: '所含模块',
        width: 300,
        render: (modules: any[]) => {
          let value = '';
          modules.forEach((item) => (value += `${item.title}+`));
          return value.slice(0, -1);
        },
      },
      {
        dataIndex: 'introduce',
        title: '内容介绍',
        render: (introduce: string) => <div className={styles.ellipsis}>{introduce}</div>,
      },
      {
        dataIndex: '_id',
        title: '操作',
        width: 200,
        render: (id: string) => (
          <div className={styles.operation}>
            <Button type="link" onClick={() => handleOperateInfo(id, 1)}>
              编辑
            </Button>
            <Button type="link" onClick={() => handleOperateInfo(id, 2)}>
              查看
            </Button>
            <Button type="link" onClick={() => handleDeleteInfo(id)}>
              删除
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const handleDeleteInfo = (id: string) => {
    Modal.warn({
      title: '删除数据',
      content: '数据一旦删除成功就无法回复，确定删除吗？',
      okText: '确定',
      showCancel: true,
      cancelText: '取消',
      onOk: () => {
        console.log(id);
      },
    });
  };

  const handleOperateInfo = (id: string, type: number) => {
    props.navigator(`/manage/permission?state=${type}&taskId=${id}`);
  };

  // 获取表格数据的方法
  const queryDataSource = useCallback(
    (size?: number, num?: number, condition?: string) => {
      const pageNum = typeof num === 'undefined' ? state.pageNum : num;
      const pageSize = typeof size === 'undefined' ? state.pageSize : size;
      const course = typeof condition === 'undefined' ? state.searchCondition : condition;

      setState({ loading: true });
      querySyllabus({ pageNum, pageSize, course })
        .then((response: any) => {
          const { data, code } = response || {};
          if (code === 0) {
            const { list, pageNum, total } = data;
            setState(() => ({ dataSource: list, total, pageNum }));
          }
        })
        .finally(() => setState({ loading: false }));
    },
    [pageSize, pageNum, searchCondition],
  );

  // 分页器
  const handlePaginationChange = useCallback(
    (pageNum: number) => {
      queryDataSource(pageSize, pageNum, searchCondition);
    },
    [pageSize, searchCondition],
  );

  const handleSearchConditionChange = useCallback((event: any) => {
    setState({ searchCondition: event.target.value });
  }, []);

  // 按条件查询
  const handleSearch = useCallback(() => {
    queryDataSource(pageSize, 1, searchCondition);
  }, [pageSize, searchCondition]);

  // 页面初始化的时候，获取页面相关数据
  useLayoutEffect(queryDataSource, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.page_title}>课程大纲</h1>
      <div>
        <Input.Search
          placeholder="输入要查询的课程名称"
          value={searchCondition}
          onChange={handleSearchConditionChange}
          onSearch={handleSearch}
          width={300}
        />
      </div>

      <Table style={{ marginTop: 20 }} columns={columns} dataSource={dataSource} loading={loading} rowKey="_id" />
      <Pagination
        pageSize={pageSize}
        pageNum={pageNum}
        total={total}
        onChange={handlePaginationChange}
        className={styles.pagination}
      />
    </div>
  );
}

export default connect(mapStateFromProps, mapDispatchFromProps)(memo(Record));
