import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import actions from '@/redux/actions/home';

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
    return <div>hello world home page</div>;
  }
}

export default connect(mapStateFromProps, mapDispatchFromProps)(Home);
