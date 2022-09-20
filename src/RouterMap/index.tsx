import React from 'react';
import { HashRouter, useRoutes, Routes, Route } from 'react-router-dom';
import Layout from '@/common/Layout';
import DynamicImport from '@/common/DynamicImport';
import homeReducer from '@/redux/reducers/home';
import manage from './manage';

const Home = DynamicImport(() => import('@/pages/home'), { home: homeReducer });
const CreateActiveInfo = DynamicImport(() => import('@/pages/createActiveInfo'));
const Login = DynamicImport(() => import('@/pages/login'));
const User = DynamicImport(() => import('@/pages/user'));

function RouterMap() {
  return useRoutes([
    {
      path: '/login',
      element: <Login/>
    },
    {
      path: '/register',
      element: <Login/>
    },
    {
      element: <Layout />,
      path: "/",
      children: [
        { element: <Home />, path: '/' },
        { element: <Home />, path: '/home' },
        { element: <CreateActiveInfo />, path: '/component' },
        { element: <User />, path: '/user' },
        ...manage,
      ],
    },
  ]);
}

export default function () {
  return (
    <HashRouter>
      <RouterMap />
    </HashRouter>
  );
}
