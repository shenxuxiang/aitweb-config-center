import React, { createRef } from 'react';
import * as ReactDOM from 'react-dom/client';
import Notify from './Notify';
import './index.less';

type INotifyType = 'success' | 'error' | 'warn';
interface IMessage {
  type: INotifyType;
  title: string;
  id: string;
  duration: number;
}

interface IState {
  messages: IMessage[];
}

class Container extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  handleDelete = (id: string) => {
    const { messages } = this.state;
    const msgs = messages.filter((item) => item.id !== id);
    this.setState({ messages: msgs });
  };

  render() {
    return (
      <div>
        {this.state.messages?.map((item: any) => (
          <Notify
            key={item.id}
            type={item.type}
            id={item.id}
            title={item.title}
            duration={item.duration}
            onClosed={this.handleDelete}
          />
        ))}
      </div>
    );
  }
}

class Message {
  public notifyRef: any;

  constructor() {
    const root = document.createElement('div');
    root.className = 'ait-message';
    document.body?.append(root);

    const container = ReactDOM.createRoot(root);
    this.notifyRef = createRef();
    container.render(<Container ref={this.notifyRef} />);
  }

  createKey() {
    return Math.random().toString(32).slice(2);
  }

  notify(title: string, duration: number, type: INotifyType) {
    const comp = this.notifyRef.current;
    const id = this.createKey();
    comp.setState((prevState: IState) => ({
      messages: prevState.messages.concat({
        title,
        type,
        duration,
        id,
      }),
    }));
  }

  success(content: string, duration = 3000) {
    this.notify(content, duration, 'success');
  }

  error(content: string, duration = 3000) {
    this.notify(content, duration, 'error');
  }

  warn(content: string, duration = 3000) {
    this.notify(content, duration, 'warn');
  }
}
const message = new Message();
export default message;
