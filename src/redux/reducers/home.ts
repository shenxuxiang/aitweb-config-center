import { AnyAction } from 'redux';
import { actions } from '@/redux/actions/home';

export default function (state = {}, action: AnyAction) {
  switch (action.type) {
    case actions.SOURCE_LIST:
      return { ...state, sourceList: action.data };
    default:
      return state;
  }
}
