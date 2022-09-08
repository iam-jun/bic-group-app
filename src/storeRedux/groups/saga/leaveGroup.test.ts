import i18next from 'i18next';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import { Platform as RNPlatform } from 'react-native';
import leaveGroup, { navigateToGroup, navigationReplace } from './leaveGroup';
import groupsActions from '../actions';
import groupApi from '../../../api/GroupApi';
import * as modalActions from '../../modal/actions';
import { groupPrivacy } from '../../../constants/privacyTypes';
import groupJoinStatus from '../../../constants/groupJoinStatus';

describe('Leave Group Saga', () => {
  let Platform: any;
  const action = {
    type: 'test',
    payload: '1',
  };

  beforeEach(() => {
    Platform = RNPlatform;
  });

  it('leaves secret group on mobile platform successfully', () => {
    Platform.OS = 'ios';
    const state = {
      groups: {
        groupDetail: { group: { privacy: groupPrivacy.secret } },
      },
    };

    return expectSaga(leaveGroup, action)
      .withState(state)
      .provide([[matchers.call.fn(groupApi.leaveGroup), {}]])
      .put(
        groupsActions.editDiscoverGroupItem({
          id: action.payload,
          data: { joinStatus: groupJoinStatus.visitor },
        }),
      )
      .call(navigationReplace)
      .put(groupsActions.getGroupDetail({ groupId: action.payload }))
      .put(
        modalActions.showHideToastMessage({
          content: i18next.t(
            'groups:modal_confirm_leave_group:success_message',
          ),
        }),
      )
      .run();
  });

  it('leaves non-secret group successfully', () => {
    const state = {
      groups: { groupDetail: { group: { privacy: groupPrivacy.public } } },
    };

    return expectSaga(leaveGroup, action)
      .withState(state)
      .provide([[matchers.call.fn(groupApi.leaveGroup), {}]])
      .put(
        groupsActions.editDiscoverGroupItem({
          id: action.payload,
          data: { joinStatus: groupJoinStatus.visitor },
        }),
      )
      .call(navigateToGroup, action.payload)
      .put(groupsActions.getGroupDetail({ groupId: action.payload }))
      .put(
        modalActions.showHideToastMessage({
          content: i18next.t(
            'groups:modal_confirm_leave_group:success_message',
          ),
        }),
      )
      .run();
  });

  it('should show error when calling server and error occurs', () => {
    const state = {
      groups: { groupDetail: { group: { privacy: groupPrivacy.public } } },
    };
    const error = { meta: { message: 'Some error occurs!' } };

    return expectSaga(leaveGroup, action)
      .withState(state)
      .provide([
        [matchers.call.fn(groupApi.leaveGroup), Promise.reject(error)],
      ])
      .put(
        modalActions.showHideToastMessage({
          content: error.meta.message,
          props: { type: 'error' },
        }),
      )
      .run();
  });
});
