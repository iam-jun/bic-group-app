import i18next from 'i18next';
import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import leaveGroup from './leaveGroup';
import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import * as modalActions from '~/store/modal/actions';
import {groupPrivacy} from '~/constants/privacyTypes';

describe('Leave Group Saga', () => {
  const action = {
    type: 'test',
    payload: 1,
  };

  it('leaves secret group successfully', () => {
    const state = {
      groups: {groupDetail: {group: {privacy: groupPrivacy.secret}}},
    };

    // @ts-ignore
    return expectSaga(leaveGroup, action)
      .withState(state)
      .provide([[matchers.call.fn(groupsDataHelper.leaveGroup), {}]])
      .put(groupsActions.getJoinedGroups())
      .put(groupsActions.setLoadingPage(true))
      .put(groupsActions.getGroupDetail(action.payload))
      .put(
        modalActions.showHideToastMessage({
          content: i18next.t(
            'groups:modal_confirm_leave_group:success_message',
          ),
          props: {
            type: 'success',
          },
        }),
      )
      .run();
  });

  it('leaves non-secret group successfully', () => {
    const state = {
      groups: {groupDetail: {group: {privacy: groupPrivacy.public}}},
    };

    // @ts-ignore
    return expectSaga(leaveGroup, action)
      .withState(state)
      .provide([[matchers.call.fn(groupsDataHelper.leaveGroup), {}]])
      .put(groupsActions.getJoinedGroups())
      .put(groupsActions.setLoadingPage(true))
      .put(groupsActions.getGroupDetail(action.payload))
      .put(
        modalActions.showHideToastMessage({
          content: i18next.t(
            'groups:modal_confirm_leave_group:success_message',
          ),
          props: {
            type: 'success',
          },
        }),
      )
      .run();
  });

  it('should show error when calling server and error occurs', () => {
    const state = {
      groups: {groupDetail: {group: {privacy: groupPrivacy.public}}},
    };
    const error = {meta: {message: 'Some error occurs!'}};

    // @ts-ignore
    return expectSaga(leaveGroup, action)
      .withState(state)
      .provide([
        [matchers.call.fn(groupsDataHelper.leaveGroup), Promise.reject(error)],
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
