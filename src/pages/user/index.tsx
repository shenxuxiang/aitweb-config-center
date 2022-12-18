import React, { PureComponent } from 'react';
import { Button, Space } from 'antd';

export default class extends PureComponent<any, any> {
  render() {
    return (
      <section>
        <Space>
          <Button type="primary">用户中心</Button>
          <Button type="primary">production</Button>
          <Button>用户中心</Button>
          <Button type="dashed">production112233</Button>
        </Space>
      </section>
    );
  }
}
