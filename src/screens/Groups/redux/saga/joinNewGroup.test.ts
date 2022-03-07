import i18next from 'i18next';
import {expectSaga} from 'redux-saga-test-plan';
import {throwError} from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';

import joinNewGroup from './joinNewGroup';
import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import * as modalActions from '~/store/modal/actions';

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
          {data: {join_status: 3}},
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
          {data: {join_status: 2}},
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
      .put(groupsActions.setLoadingPage(true))
      .put(groupsActions.getGroupDetail(groupId))
      .run();
  });
});
