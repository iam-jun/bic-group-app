import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import removeGroupAdmin from './removeGroupAdmin';
import groupApi from '../../../api/GroupApi';
import * as modalActions from '../../modal/actions';
import { refreshGroupMembers } from './index';
import showError from '../../commonSaga/showError';

describe('Remove group admin', () => {
  const action = { type: 'test', payload: { groupId: '1', userId: '1' } };
  it('should remove admin role successfully', () => expectSaga(removeGroupAdmin, action)
    .provide([[matchers.call.fn(groupApi.removeGroupAdmin), {}]])
    .put(
      modalActions.showHideToastMessage({
        content: 'groups:modal_confirm_remove_admin:success_message',
      }),
    )
    .call(refreshGroupMembers, action.payload.groupId)
    .run());

  it('should call server and error occurs', () => {
    const error = { code: 1 };
    return expectSaga(removeGroupAdmin, action)
      .provide([
        [
          matchers.call.fn(groupApi.removeGroupAdmin),
          Promise.reject(error),
        ],
      ])
      .call(showError, error)
      .run();
  });
});
