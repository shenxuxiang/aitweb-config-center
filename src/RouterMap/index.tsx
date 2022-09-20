import React from 'react';
import { HashRouter, useRoutes } from 'react-router-dom';
import Layout from '@/common/Layout';
import DynamicImport from '@/common/DynamicImport';
import homeReducer from '@/redux/reducers/home';
import manage from './manage';

const Home = DynamicImport(() => import('@/pages/home'), { home: homeReducer });
const CreateActiveInfo = DynamicImport(() => import('@/pages/createActiveInfo'));
const Login = DynamicImport(() => import('@/pages/login'));

function RouterMap() {
  return useRoutes([
    { element: <Home />, path: '' },
    { element: <Home />, path: '/home' },
    { element: <CreateActiveInfo />, path: '/component' },
    { element: <Login />, path: '/user' },
    ...manage,
  ]);
}

export default function () {
  return (
    <HashRouter>
      <Layout>
        <RouterMap />
      </Layout>
    </HashRouter>
  );
}
