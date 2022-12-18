import React, { PureComponent } from 'react';
import { Button, Space } from 'antd';

export default class extends PureComponent<any, any> {
  render() {
    return (
      <section>
        <Space>
          <Button type="primary">用户中心</Button>
          {/* <Button>用户中心</Button> */}
          <Button type="primary">development</Button>
          <Button type="dashed">development</Button>
          <Button>用户中心aa</Button>
        </Space>
      </section>
    );
  }
}
