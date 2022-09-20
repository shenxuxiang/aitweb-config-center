import { useState } from 'react';

interface IState {
  [propName: string]: any;
}
type IAction<S> = Partial<S> | ((state: S) => Partial<S> | null);
type SetState<S> = (action: IAction<S>) => void;

function reducer<S>(state: S, action: Partial<S> | null): S {
  // eslint-disable-next-line
  if (action == null) return state;

  return { ...state, ...action };
}

export default function useReducer<S extends IState>(initialState: S): [S, SetState<S>] {
  const [state, dispatch] = useState(initialState);
  function setState(action: IAction<S>): void {
    if (typeof action === 'function') {
      dispatch((prevState) => reducer(prevState, action(prevState)));
    } else {
      dispatch((prevState) => reducer(prevState, action));
    }
  }
  return [state, setState];
}
