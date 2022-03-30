import i18next from 'i18next';
import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import joinNewGroup from './joinNewGroup';
import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import * as modalActions from '~/store/modal/actions';
import groupJoinStatus from '~/constants/groupJoinStatus';

describe('Join New Group Saga', () => {
  const action = {
    type: 'test',
    payload: {groupId: 1, groupName: 'Testing group'},
  };

  const {groupId, groupName} = action.payload;

  it('should request to join group successfully', () => {
    return expectSaga(joinNewGroup, action)
      .provide([
        [
          matchers.call.fn(groupsDataHelper.joinGroup),
          {data: {join_status: groupJoinStatus.requested}},
        ],
      ])
      .put(groupsActions.getGroupDetail(groupId))
      .put(
        modalActions.showHideToastMessage({
          content: `${i18next.t(
            'groups:text_request_join_group',
          )} ${groupName}`,
          props: {
            type: 'success',
          },
        }),
      )
      .run();
  });

  it('should join the group successfully', () => {
    return expectSaga(joinNewGroup, action)
      .provide([
        [
          matchers.call.fn(groupsDataHelper.joinGroup),
          {data: {join_status: groupJoinStatus.member}},
        ],
      ])
      .put(groupsActions.getJoinedGroups())
      .put(
        modalActions.showHideToastMessage({
          content: `${i18next.t(
            'groups:text_successfully_join_group',
          )} ${groupName}`,
          props: {
            type: 'success',
          },
        }),
      )
      .put(groupsActions.getGroupDetail(groupId, true))
      .run();
  });

  it('should show error when calling server and error occurs', () => {
    const error = {meta: {message: 'Some error occurs!'}};

    return expectSaga(joinNewGroup, action)
      .provide([
        [matchers.call.fn(groupsDataHelper.joinGroup), Promise.reject(error)],
      ])
      .put(
        modalActions.showHideToastMessage({
          content: error.meta.message,
          props: {
            textProps: {useI18n: true},
            type: 'error',
          },
        }),
      )
      .run();
  });
});
