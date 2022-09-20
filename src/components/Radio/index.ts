/* eslint-disable */
import Radio, { RadioProps } from './Radio';
import RadioGroup, { RadioGroupProps } from './RadioGroup';

type RadioType = React.MemoExoticComponent<(props: RadioProps) => JSX.Element> & {
  Group: React.MemoExoticComponent<(props: RadioGroupProps) => JSX.Element>;
};

const Comp = Radio as RadioType;
Comp.Group = RadioGroup;

export default Comp;
