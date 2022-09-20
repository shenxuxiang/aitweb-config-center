import React, { memo, useCallback, useLayoutEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './index.module.less';
import Menu from '@/components/Menu';

const menuList = [
  {
    title: '活动信息',
    id: '0001',
    icon: 'shezhi',
    url: '/manage/activity-info',
  },
  {
    title: '数据管理',
    id: '0002',
    icon: 'bujianguanli',
    url: '/manage/record',
  },
  {
    title: '用户权限',
    id: '0003',
    icon: 'permission',
    url: '/manage/permission',
  },
];

function Management() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [state, setState] = useState('');

  const handleNavigate = useCallback((id: string) => {
    const url = menuList.find((item) => item.id === id)?.url;
    if (url) navigate(url);
  }, []);

  useLayoutEffect(() => {
    const id = menuList.find((item) => item.url === pathname)?.id ?? menuList[0].id;
    if (id) setState(id);
  }, [pathname]);

  return (
    <div className={styles.page_wrapper}>
      <aside className={styles.page_left}>
        <Menu menuList={menuList} onClick={handleNavigate} currentMenu={state} />
      </aside>
      <div className={styles.page_body}>
        <Outlet />
      </div>
    </div>
  );
}

export default memo(Management);
