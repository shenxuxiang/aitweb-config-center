/* eslint-disable */
import Input, { InputProps } from './Input';
import Search, { SearchProps } from './Search';

type Comp = React.MemoExoticComponent<(props: InputProps) => JSX.Element> & {
  Search: React.MemoExoticComponent<(props: SearchProps) => JSX.Element>;
};

const comp = Input as Comp;
comp.Search = Search;

export default comp;
