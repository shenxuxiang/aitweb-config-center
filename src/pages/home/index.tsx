import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import actions from '@/redux/actions/home';
import Foo from './Foo';
import classes from './index.module.less';
const mapStateFromProps = (state: any) => state.home;

const mapDispatchFromProps = (dispatch: Dispatch) => bindActionCreators(actions, dispatch);

class Home extends PureComponent<any, any> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props);
  }

  render() {
    return <div className={classes.content}>
      <div className={classes.body}>11122333</div>
    </div>;
  }
}

export default connect(mapStateFromProps, mapDispatchFromProps)(Home);
