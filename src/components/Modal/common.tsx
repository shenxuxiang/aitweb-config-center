import React, { PureComponent, createRef } from 'react';
import * as ReactDOM from 'react-dom/client';
import Modal from './index';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { requestAnimationFrame } from '@/utils';
import './index.less';

class ModalWrapper extends PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      children: null,
      maskClosable: false,
      onClosed: null,
      renderNull: false,
      unMount: null,
    };
  }

  handleCloseMoal = () => {
    this.setState({ visible: false });
    setTimeout(() => this.setState({ renderNull: true }), 400);
    setTimeout(() => this.state.unMount?.(), 500);
  };

  render() {
    if (this.state.renderNull) return null;

    return (
      <Modal
        visible={this.state.visible}
        width={400}
        foot={false}
        title={null}
        closable={false}
        maskClosable={this.state.maskClosable}
        onOk={this.handleCloseMoal}
        onCancel={this.handleCloseMoal}
        children={this.state.children}
        onClosed={this.state.onClosed}
      />
    );
  }
}

export interface CommonOpts {
  title: string;
  content: string | React.ReactNode;
  showOk?: boolean;
  okText?: string;
  showCancel?: boolean;
  cancelText?: string;
  onCancel?: () => void;
  onOk?: () => void;
  icon?: string;
  iconColor?: string;
  maskClosable?: boolean;
  onClosed?: () => void;
}

class CreateModal {
  public modalRef: any;

  public root: HTMLElement | null;

  constructor() {
    this.modalRef = createRef();
    this.root = null;
  }

  // 创建容器
  initial = () => {
    this.root = document.createElement('div');
    document.body.appendChild(this.root);
    const container = ReactDOM.createRoot(this.root);
    container.render(<ModalWrapper ref={this.modalRef} />);
  };

  // 组件实例挂载
  mount = (opts: CommonOpts) => {
    this.initial();
    const {
      title,
      content,
      showOk = true,
      okText = '知道了',
      showCancel = false,
      cancelText = '取消',
      onCancel,
      onOk,
      icon,
      iconColor,
      maskClosable = false,
      onClosed,
    } = opts;

    const handleClickOk = () => {
      this.modalRef.current.setState({ visible: false });
      onOk?.();
    };

    const handleClickCancel = () => {
      this.modalRef.current.setState({ visible: false });
      onCancel?.();
    };

    const children = (
      <div className="ait-modal-confirm-x">
        {icon ? (
          <div className="ait-modal-confirm-icon-x">
            <Icon name={icon} className="ait-modal-confirm-icon" style={{ color: iconColor }} />
          </div>
        ) : null}
        {title ? <div className="ait-modal-confirm-title">{title}</div> : null}
        <div className="ait-modal-confirm-body">{content}</div>
        <div className="ait-modal-confirm-foot">
          {showCancel && (
            <Button type="ghost" className="ait-modal-confirm-foot-button" onClick={handleClickCancel}>
              {cancelText}
            </Button>
          )}
          {showOk && (
            <Button type="primary" className="ait-modal-confirm-foot-button" onClick={handleClickOk}>
              {okText}
            </Button>
          )}
        </div>
      </div>
    );

    const hasDidMount = () => {
      if (this.modalRef.current) {
        this.modalRef.current.setState({
          visible: true,
          children,
          unMount: this.unMount,
          maskClosable,
          onClosed,
        });
      } else {
        requestAnimationFrame(hasDidMount);
      }
    };

    hasDidMount();
  };

  // 卸载组件实例对象，并删除对应的 DOM 节点。
  unMount = () => {
    if (this.root) {
      document.body.removeChild(this.root);
      this.root = null;
    }
  };

  info = (opts: CommonOpts) => {
    const props = { ...opts };
    if (typeof props.icon === 'undefined') {
      props.icon = 'jinggao';
      props.iconColor = '#1890ff';
    }
    this.mount(props);
  };

  success = (opts: CommonOpts) => {
    const props = { ...opts };
    if (typeof props.icon === 'undefined') {
      props.icon = 'success';
      props.iconColor = '#52c41a';
    }
    this.mount(props);
  };

  error = (opts: CommonOpts) => {
    const props = { ...opts };
    if (typeof props.icon === 'undefined') {
      props.icon = 'error';
      props.iconColor = '#f5222d';
    }
    this.mount(props);
  };

  warn = (opts: CommonOpts) => {
    const props = { ...opts };
    if (typeof props.icon === 'undefined') {
      props.icon = 'warn';
      props.iconColor = '#faad14';
    }
    this.mount(props);
  };
}

export default {
  info: (opts: CommonOpts) => {
    const modal = new CreateModal();
    modal.info(opts);
  },
  success: (opts: CommonOpts) => {
    const modal = new CreateModal();
    modal.success(opts);
  },
  error: (opts: CommonOpts) => {
    const modal = new CreateModal();
    modal.error(opts);
  },
  warn: (opts: CommonOpts) => {
    const modal = new CreateModal();
    modal.warn(opts);
  },
};
