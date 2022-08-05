import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import removeGroupAdmin from './removeGroupAdmin';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import * as modalActions from '~/store/modal/actions';
import { refreshGroupMembers } from '.';
import showError from '~/store/commonSaga/showError';

describe('Remove group admin', () => {
  const action = { type: 'test', payload: { groupId: 1, userId: 1 } };
  it('should remove admin role successfully', () => expectSaga(removeGroupAdmin, action)
    .provide([[matchers.call.fn(groupsDataHelper.removeGroupAdmin), {}]])
    .put(
      modalActions.showHideToastMessage({
        content: 'groups:modal_confirm_remove_admin:success_message',
        props: {
          textProps: { useI18n: true },
          type: 'success',
        },
      }),
    )
    .call(refreshGroupMembers, action.payload.groupId)
    .run());

  it('should call server and error occurs', () => {
    const error = { code: 1 };
    return expectSaga(removeGroupAdmin, action)
      .provide([
        [
          matchers.call.fn(groupsDataHelper.removeGroupAdmin),
          Promise.reject(error),
        ],
      ])
      .call(showError, error)
      .run();
  });
});
