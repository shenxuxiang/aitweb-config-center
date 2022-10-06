import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import RouterMap from '@/RouterMap';
import store from '@/redux';
import './index.less';
import '@/utils/performance';

const root = document.getElementById('root');
const container = ReactDOM.createRoot(root!);
console.log('hello world 3333');
class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <RouterMap />
      </Provider>
    );
  }
}

container.render(<App />);
<<<<<<< HEAD
<<<<<<< HEAD


=======
console.log('hello world333');
>>>>>>> e1a1edf (feat: 添加第三个 helloworld 日志)
=======
console.log('hello world');
console.log('hello world2222');
>>>>>>> 56786db (feat: 添加第二个 helloworld 日志)
