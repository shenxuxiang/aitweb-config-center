import { AnyAction } from 'redux';

export default function main(state = {}, action: AnyAction) {
  switch (action.type) {
    default:
      return state;
  }
}
