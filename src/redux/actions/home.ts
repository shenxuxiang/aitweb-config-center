import { Dispatch } from 'redux';

function query(body: any) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(body), 1000);
  });
}

export const actions = {
  SOURCE_LIST: 'SOURCE_LIST',
};

export default {
  querySourceList(body: any) {
    return function (dispatch: Dispatch) {
      query(body).then((data) => {
        dispatch({ data, type: actions.SOURCE_LIST });
      });
    };
  },
};
