import { AnyAction } from 'redux';
import { actions } from '@/redux/actions/login';

export default function login(state = {}, action: AnyAction) {
  switch (action.type) {
    case actions.LOGIN:
      return { ...state, login: action.data?.data };
    case actions.REGISTER:
      return { ...state, register: action.data?.data };
    case actions.USERNAME:
      return { ...state, userNameExist: action.data?.data };
    default:
      return state;
  }
}
