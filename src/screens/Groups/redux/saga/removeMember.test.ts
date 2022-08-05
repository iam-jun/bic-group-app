import i18next from 'i18next';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import removeMember from './removeMember';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import * as modalActions from '~/store/modal/actions';
import { refreshGroupMembers } from '.';

describe('Remove member saga', () => {
  const action = {
    type: 'test',
    payload: { groupId: 1, userId: '1', userFullname: 'Test Name' },
  };

  it('should remove member successfully', () => {
    const { groupId, userFullname } = action.payload;
    return expectSaga(removeMember, action)
      .provide([[matchers.call.fn(groupsDataHelper.removeUsers), {}]])
      .call(refreshGroupMembers, groupId)
      .put(
        modalActions.showHideToastMessage({
          content: i18next
            .t('common:message_remove_member_success')
            .replace('{n}', userFullname),
          props: {
            textProps: { useI18n: true },
            type: 'success',
          },
        }),
      )
      .run();
  });

  it('should call server and error occurs', () => expectSaga(removeMember, action)
    .provide([
      [
        matchers.call.fn(groupsDataHelper.removeUsers),
        Promise.reject({ code: 1 }),
      ],
    ])
    .put(
      modalActions.showHideToastMessage({
        content: 'common:text_error_message',
        props: {
          textProps: { useI18n: true },
          type: 'error',
        },
      }),
    )
    .run());
});
