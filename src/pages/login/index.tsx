import React, { PureComponent } from 'react';
import styles from './index.module.less';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Spin from '@/components/Spin';
import actions from '@/redux/actions/login';
import message from '@/components/Message';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

const mapDispatchFromProps = (dispatch: Dispatch) => {
  return bindActionCreators(actions, dispatch);
};

class Login extends PureComponent<any, any> {
  public type: 'login' | 'register';

  constructor(props: any) {
    super(props); console.log(props);
    this.type = props.location.pathname === '/login' ? 'login' : 'register';
    this.state = {
      userName: '',
      password: '',
      loading: false,
    }
  }

  handleChangeUserName = (event: any) => {
    this.setState({ userName: event.target.value });
  }

  handleChangePassword = (event: any) => {
    this.setState({ password: event.target.value });
  }

  onSubmit = () => {
    console.log(this.state);
    const { userName, password } = this.state;
    if (!userName) {
      return message.warn('用户名不能为空');
    } else if (!password) {
      return message.warn('用户密码不能为空');
    }
    this.props.login({ userName, password })
      .then((response: any) => {console.log(response);
        if (response.code === 0) {
          const search = this.props.location.search;
          const page = search.split('?redirect=')[1];
          this.props.navigator(page ? decodeURIComponent(page) : '/home');
        }
      })
      .catch((error: any) => {
        console.log(error);
      })
  }

  onRegister = () => {
    const { userName, password } = this.state;
    if (!userName) {
      return message.warn('用户名不能为空');
    } else if (!password) {
      return message.warn('用户密码不能为空');
    }
    this.props.register({ userName, password })
      .then((response: any) => {
        console.log(response);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  handleNavigateToRegister = () => {
    this.props.navigator('/register');
    window.location.reload();
  }

  render() {
    const { userName, password, loading } = this.state;
    return (
      <Spin spinning={loading}>
        <section className={styles.page_login}>
          <div className={styles.login_wrapper}>
            <div className={styles.form_item}>
              <span className={styles.form_item_title}>用户名：</span>
              <Input
                value={userName}
                placeholder="请输入用户名"
                onChange={this.handleChangeUserName}
              />
            </div>
            <div className={styles.form_item}>
              <span className={styles.form_item_title}>密码：</span>
              <Input
                type="password"
                value={password}
                placeholder="请输入用户密码"
                onChange={this.handleChangePassword}
                rules={[{ message: '密码格式不正确', pattern: /^[0-9a-zA-Z]{6}$/ }]}
              />
            </div>
            <div className={`${styles.form_item} ${styles.form_submit}`}>
              {
                this.type === 'login' ?
                  <Button type="primary" style={{ width: 100 }} onClick={this.onSubmit}>登录</Button> :
                  <Button type="primary" style={{ width: 100 }} onClick={this.onRegister}>注册</Button>
              }
            </div>
            {
              this.type === 'login' ?
                <div className={styles.foot}>
                  还没有账号，去
                  <Button type="link" onClick={this.handleNavigateToRegister}>注册</Button>
                </div> : null
            }
          </div>
        </section>

      </Spin>
    );
  }
}

export default connect(null, mapDispatchFromProps)(Login);
