import { Dispatch } from 'redux';
import request from '@/utils/request';

export const actions = {
  QUERY_SYLLABUS: 'QUERY_SYLLABUS',
};

export default {
  querySyllabus(query: any) {
    return (dispatch: Dispatch) =>
      request.post('/api/query/syllabus', query).then((response) => {
        dispatch({ data: response, type: actions.QUERY_SYLLABUS });
        return response;
      });
  },
};
