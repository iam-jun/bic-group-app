import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import modalActions from '../../modal/actions';
import approveSingleGroupMemberRequest from './approveSingleGroupMemberRequest';
import groupsActions from '../actions';
import groupApi from '../../../api/GroupApi';
import showError from '../../commonSaga/showError';
import approveDeclineCode from '../../../constants/approveDeclineCode';

describe('approveSingleGroupMemberRequest saga', () => {
  const groupId = '1';
  const requestId = '1';
  const fullName = 'Test User Name';
  const callback = jest.fn();
  const action = {
    type: 'string',
    payload: {
      groupId, requestId, fullName, callback,
    },
  };

  const state = {
    groups: {
      groupMemberRequests: {
        total: 2,
        ids: ['1', '2'],
        items: { 1: {}, 2: {} },
      },
    },
  };

  it('should approve selected member request correctly', async () => expectSaga(approveSingleGroupMemberRequest, action)
    .withState(state)
    .provide([
      [
        matchers.call.fn(groupApi.approveSingleGroupMemberRequest),
        {},
      ],
    ])
    .put(
      groupsActions.setGroupMemberRequests({
        total: 1,
        ids: ['2'],
        items: { 2: {} } as any,
      }),
    )
    .put(
      modalActions.showHideToastMessage({
        content: `Approved user ${fullName}`,
        props: {
          textProps: { useI18n: true },
          type: 'success',
          rightIcon: 'UserGroup',
          rightText: 'Members',
          onPressRight: callback,
        },
        toastType: 'normal',
      }),
    )
    .put(groupsActions.getGroupDetail({ groupId }))
    .run());

  it('should call server and server throws Canceled join request error', async () => {
    const error = { code: approveDeclineCode.CANCELED };
    return expectSaga(approveSingleGroupMemberRequest, action)
      .withState(state)
      .provide([
        [
          matchers.call.fn(groupApi.approveSingleGroupMemberRequest),
          Promise.reject(error),
        ],
      ])
      .put(
        groupsActions.editGroupMemberRequest({
          id: requestId,
          data: { isCanceled: true },
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('should call server and server throws some error', async () => {
    const error = { code: 'error' };
    return expectSaga(approveSingleGroupMemberRequest, action)
      .withState(state)
      .provide([
        [
          matchers.call.fn(groupApi.approveSingleGroupMemberRequest),
          Promise.reject(error),
        ],
      ])
      .call(showError, error)
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
