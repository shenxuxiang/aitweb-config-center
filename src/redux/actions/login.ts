import { Dispatch } from 'redux';
import request from '@/utils/request';
export const actions = {
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
  USERNAME: 'USERNAME',
};

export default {
  login(body: any) {
    return (dispatch: Dispatch) =>
      request.post('/api/query/login', body).then((data) => {
        dispatch({ data, type: actions.LOGIN });
        return data;
      });
  },
  register(body: any) {
    return (dispatch: Dispatch) =>
      request.post('/api/query/register', body).then((data) => {
        dispatch({ data, type: actions.REGISTER });
        return data;
      });
  },
};
