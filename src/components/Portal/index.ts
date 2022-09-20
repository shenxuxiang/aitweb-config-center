import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  containerClassName?: string;
}

export default class Portal extends PureComponent<PortalProps> {
  public root: HTMLDivElement;

  constructor(props: PortalProps) {
    super(props);
    this.state = {};
    this.root = document.createElement('div');
    if (props.containerClassName) this.root.className = props.containerClassName;
    document.body.appendChild(this.root);
  }

  componentWillUnmount() {
    if (this.root) document.body.removeChild(this.root);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.root);
  }
}
