import { AnyAction } from 'redux';
import { actions } from '@/redux/actions/manage-record';

export default function manageRecord(state = {}, action: AnyAction) {
  switch (action.type) {
    case actions.QUERY_SYLLABUS:
      return { ...state, syllabus: action.data };
    default:
      return state;
  }
}
