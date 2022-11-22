import i18next from 'i18next';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import { Platform as RNPlatform } from 'react-native';
import leaveGroup, { navigateToGroup, navigationPopToTop } from './leaveGroup';
import groupsActions from '../actions';
import groupApi from '../../../api/GroupApi';
import * as modalActions from '../../modal/actions';
import GroupJoinStatus from '../../../constants/GroupJoinStatus';
import { GroupPrivacyType } from '~/constants/privacyTypes';

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
        groupDetail: { group: { privacy: GroupPrivacyType.SECRET } },
      },
    };

    return expectSaga(leaveGroup, action)
      .withState(state)
      .provide([[matchers.call.fn(groupApi.leaveGroup), {}]])
      .put(
        groupsActions.editDiscoverGroupItem({
          id: action.payload,
          data: { joinStatus: GroupJoinStatus.VISITOR },
        }),
      )
      .call(navigationPopToTop)
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
      groups: { groupDetail: { group: { privacy: GroupPrivacyType.PUBLIC } } },
    };

    return expectSaga(leaveGroup, action)
      .withState(state)
      .provide([[matchers.call.fn(groupApi.leaveGroup), {}]])
      .put(
        groupsActions.editDiscoverGroupItem({
          id: action.payload,
          data: { joinStatus: GroupJoinStatus.VISITOR },
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
      groups: { groupDetail: { group: { privacy: GroupPrivacyType.PUBLIC } } },
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
