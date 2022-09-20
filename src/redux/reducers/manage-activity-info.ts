import { AnyAction } from 'redux';
import { actions } from '@/redux/actions/manage-activity-info';

export default function manageActivityInfo(state = {}, action: AnyAction) {
  switch (action.type) {
    case actions.QUERY_ACTIVITY_INFO:
      return { ...state, activityInfo: action.data?.data };
    default:
      return state;
  }
}
