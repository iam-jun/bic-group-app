import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import setGroupAdmin from './setGroupAdmin';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import * as modalActions from '~/store/modal/actions';
import {refreshGroupMembers, showError} from '.';

describe('Set group admin', () => {
  const action = {type: 'test', payload: {groupId: 1, userIds: [1]}};
  it('should set admin successfully', () => {
    return expectSaga(setGroupAdmin, action)
      .provide([[matchers.call.fn(groupsDataHelper.setGroupAdmin), {}]])
      .put(
        modalActions.showHideToastMessage({
          content: 'groups:modal_confirm_set_admin:success_message',
          props: {
            textProps: {useI18n: true},
            type: 'success',
          },
        }),
      )
      .call(refreshGroupMembers, action.payload.groupId)
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(8);
      });
  });

  it('should call server and error occurs', () => {
    const error = {code: 1};
    return expectSaga(setGroupAdmin, action)
      .provide([
        [
          matchers.call.fn(groupsDataHelper.setGroupAdmin),
          Promise.reject(error),
        ],
      ])
      .call(showError, error)
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
