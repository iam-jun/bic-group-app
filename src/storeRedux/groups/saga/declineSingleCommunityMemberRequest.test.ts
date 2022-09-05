import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import modalActions from '../../modal/actions';
import declineSingleCommunityMemberRequest from './declineSingleCommunityMemberRequest';
import groupsActions from '../actions';
import groupApi from '../../../api/GroupApi';
import showError from '../../commonSaga/showError';
import approveDeclineCode from '../../../constants/approveDeclineCode';

describe('declineSingleCommunityMemberRequest saga', () => {
  const communityId = '1';
  const requestId = '3';
  const fullName = 'Test User Name';
  const action = { type: 'string', payload: { communityId, requestId, fullName } };

  const state = {
    groups: {
      communityMemberRequests: {
        total: 3,
        ids: ['1', '2', '3'],
        items: { 1: {}, 2: {}, 3: {} },
      },
    },
  };

  it('should decline selected member request correctly', async () => expectSaga(declineSingleCommunityMemberRequest, action)
    .withState(state)
    .provide([
      [
        matchers.call.fn(
          groupApi.declineSingleCommunityMemberRequest,
        ),
        {},
      ],
    ])
    .put(
      groupsActions.setCommunityMemberRequests({
        total: 2,
        ids: ['1', '2'],
        items: { 1: {}, 2: {} } as any,
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
    return expectSaga(declineSingleCommunityMemberRequest, action)
      .withState(state)
      .provide([
        [
          matchers.call.fn(
            groupApi.declineSingleCommunityMemberRequest,
          ),
          Promise.reject(error),
        ],
      ])
      .put(
        groupsActions.editCommunityMemberRequest({
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
    return expectSaga(declineSingleCommunityMemberRequest, action)
      .withState(state)
      .provide([
        [
          matchers.call.fn(
            groupApi.declineSingleCommunityMemberRequest,
          ),
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
