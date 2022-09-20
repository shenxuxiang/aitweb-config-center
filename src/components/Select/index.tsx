import React, { ReactElement } from 'react';
import Select, { SelectProps } from './Select';
import Option, { OptionProps } from './Option';

type Selection = React.MemoExoticComponent<(props: SelectProps) => ReactElement> & {
  Option: React.MemoExoticComponent<(props: OptionProps) => ReactElement>;
};
const selection = Select as Selection;
selection.Option = Option;
export default selection;
