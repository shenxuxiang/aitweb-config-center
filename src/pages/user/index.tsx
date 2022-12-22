import React, { PureComponent } from 'react';
import { Button, Space } from 'antd';

export default class extends PureComponent<any, any> {
  render() {
    return (
      <section>
        <Space>
          <Button type="primary">用户中心</Button>
          <Button type="ghost">用户中心</Button>
          <Button type="dashed">用户中心ss</Button>
        </Space>
      </section>
    );
  }
}
