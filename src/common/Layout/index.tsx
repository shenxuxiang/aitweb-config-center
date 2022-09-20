import React, { PureComponent } from 'react';
import logo from '@/static/images/logo.png';
import Navigation from '@/components/Navigation';
import './index.less';

const navagateList = [
  { title: '首页', path: '/home' },
  { title: '管理中心', path: '/manage' },
  { title: '组件中心', path: '/component' },
  { title: '用户中心', path: '/user' },
];

export default class extends PureComponent<any, any> {
  public render() {
    return (
      <div className="main">
        <header className="header">
          <div className="header_logo">
            <img src={logo} className="header_logo_img" />
          </div>
          <Navigation
            navagateList={navagateList}
            width={500}
            style={{ margin: '0 50px' }}
            indicatorStyle={{ height: 2 }}
          />
        </header>
        <div className="page-container">{this.props.children}</div>
      </div>
    );
  }
}
