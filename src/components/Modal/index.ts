/* eslint-disable */
import Modal, { ModalProps } from './Modal';
import common, { CommonOpts } from './common';

type Modals = React.MemoExoticComponent<(props: ModalProps) => JSX.Element> & {
  info: (opt: CommonOpts) => void;
  success: (opt: CommonOpts) => void;
  error: (opt: CommonOpts) => void;
  warn: (opt: CommonOpts) => void;
};

const { info, success, error, warn } = common;
const Modals = Modal as Modals;

Modals.info = info;
Modals.success = success;
Modals.error = error;
Modals.warn = warn;

export default Modals;
