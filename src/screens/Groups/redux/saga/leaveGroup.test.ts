import i18next from 'i18next';
import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import leaveGroup, {navigateToGroup, navigationReplace} from './leaveGroup';
import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import * as modalActions from '~/store/modal/actions';
import {groupPrivacy} from '~/constants/privacyTypes';
import {Platform as RNPlatform} from 'react-native';

describe('Leave Group Saga', () => {
  let Platform: any;
  const action = {
    type: 'test',
    payload: 1,
  };

  beforeEach(() => {
    Platform = RNPlatform;
  });

  it('leaves secret group on mobile platform successfully', () => {
    Platform.OS = 'ios';
    const state = {
      groups: {
        groupDetail: {group: {privacy: groupPrivacy.secret}},
      },
    };

    // @ts-ignore
    return expectSaga(leaveGroup, action)
      .withState(state)
      .provide([[matchers.call.fn(groupsDataHelper.leaveGroup), {}]])
      .put(
        groupsActions.editDiscoverGroupItem({
          id: action.payload,
          data: {join_status: 1},
        }),
      )
      .call(navigationReplace)
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
      .put(
        groupsActions.editDiscoverGroupItem({
          id: action.payload,
          data: {join_status: 1},
        }),
      )
      .call(navigateToGroup, action.payload)
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
