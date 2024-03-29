import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import RouterMap from '@/RouterMap';
import store from '@/redux';
import './index.less';
import '@/utils/performance';

const root = document.getElementById('root');
const container = ReactDOM.createRoot(root!);
class App extends React.Component {
  render() {
    console.log('build');
    return (
      <Provider store={store}>
        <RouterMap />
      </Provider>
    );
  }
}

container.render(<App />);
