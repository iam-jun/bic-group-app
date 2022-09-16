import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import modalActions from '../../modal/actions';
import declineSingleGroupMemberRequest from './declineSingleGroupMemberRequest';
import groupsActions from '../actions';
import groupApi from '../../../api/GroupApi';
import showError from '../../commonSaga/showError';
import approveDeclineCode from '../../../constants/approveDeclineCode';

describe('declineSingleGroupMemberRequest saga', () => {
  const groupId = '1';
  const requestId = '2';
  const fullName = 'Test User Name';
  const action = { type: 'string', payload: { groupId, requestId, fullName } };

  const state = {
    groups: {
      groupMemberRequests: {
        total: 3,
        ids: [1, 2, 3],
        items: { 1: {}, 2: {}, 3: {} },
      },
    },
  };

  it('should decline selected member request correctly', async () => expectSaga(declineSingleGroupMemberRequest, action)
    .withState(state)
    .provide([
      [
        matchers.call.fn(groupApi.declineSingleGroupMemberRequest),
        {},
      ],
    ])
    .put(
      groupsActions.setGroupMemberRequests({
        total: 2,
        ids: ['1', '3'],
        items: { 1: {}, 3: {} } as any,
      }),
    )
    .put(
      modalActions.showHideToastMessage({
        content: `Declined user ${fullName}`,
      }),
    )
    .run()
    .then(({ allEffects }: any) => {
      expect(allEffects?.length).toEqual(4);
    }));

  it('should call server and server throws Canceled join request error', async () => {
    const error = { code: approveDeclineCode.CANCELED };
    return expectSaga(declineSingleGroupMemberRequest, action)
      .withState(state)
      .provide([
        [
          matchers.call.fn(groupApi.declineSingleGroupMemberRequest),
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

  it('should call server and server throws error', async () => {
    const error = { code: 'error' };
    return expectSaga(declineSingleGroupMemberRequest, action)
      .withState(state)
      .provide([
        [
          matchers.call.fn(groupApi.declineSingleGroupMemberRequest),
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
