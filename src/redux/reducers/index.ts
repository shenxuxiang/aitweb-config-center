import { combineReducers, AnyAction } from 'redux';

export function main(state = {}, action: AnyAction) {
  switch (action.type) {
    default:
      return state;
  }
}

export default combineReducers({ main });
