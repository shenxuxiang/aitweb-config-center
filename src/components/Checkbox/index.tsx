import CheckboxGroup, { CheckboxGroupProps } from './CheckboxGroup';
import Checkbox, { CheckboxProps } from './Checkbox';

type CheckboxType = React.MemoExoticComponent<(props: CheckboxProps) => JSX.Element> & {
  Group: React.MemoExoticComponent<(props: CheckboxGroupProps) => JSX.Element>
}
const Comp = Checkbox as CheckboxType;
Comp.Group = CheckboxGroup;

export default Comp;
