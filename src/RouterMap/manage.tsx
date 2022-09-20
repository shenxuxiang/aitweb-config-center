import React from 'react';
import DynamicImport from '@/common/DynamicImport';
import Management from '@/pages/manage';
import recordReducer from '@/redux/reducers/manage-record';
import activityInfoReducer from '@/redux/reducers/manage-activity-info';

// 活动信息
const ActivityInfo = DynamicImport(() => import('@/pages/manage/activity-info'), {
  manageActivityInfo: activityInfoReducer,
});
// 数据管理
const Record = DynamicImport(() => import('@/pages/manage/record'), { manageRecord: recordReducer });
// 用户权限
const Permissioin = DynamicImport(() => import('@/pages/manage/permission'));

export default [
  {
    element: <Management />,
    path: '/manage',
    children: [
      { element: <ActivityInfo />, path: '' },
      { element: <ActivityInfo />, path: 'activity-info' },
      { element: <Record />, path: 'record' },
      { element: <Permissioin />, path: 'permission' },
    ],
  },
];
