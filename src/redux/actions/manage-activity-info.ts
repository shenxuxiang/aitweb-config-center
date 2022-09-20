import { Dispatch } from 'redux';
import request from '@/utils/request';

export const actions = {
  QUERY_ACTIVITY_INFO: 'QUERY_ACTIVITY_INFO',
};

export default {
  queryActivityInfo() {
    return (dispatch: Dispatch) =>
      request.get('/api/query/activity-info').then((response) => {
        dispatch({ data: response, type: actions.QUERY_ACTIVITY_INFO });
        return response;
      });
  },
};
