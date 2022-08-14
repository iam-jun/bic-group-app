import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import declineAllCommunityMemberRequests from './declineAllCommunityMemberRequests';
import groupApi from '../../../api/GroupApi';
import showError from '../../commonSaga/showError';

describe('declineAllCommunityMemberRequests saga', () => {
  const communityId = 1;
  const total = 3;
  const action = {
    type: 'test',
    payload: { communityId, total },
  };

  it('should decline all member requests correctly', async () => expectSaga(declineAllCommunityMemberRequests, action)
    .provide([
      [
        matchers.call.fn(groupApi.declineAllCommunityMemberRequests),
        {},
      ],
    ])
    .run()
    .then(({ allEffects }: any) => {
      expect(allEffects?.length).toEqual(1);
    }));

  it('should call server and server throws an error', async () => {
    const error = { code: 'error' };
    return expectSaga(declineAllCommunityMemberRequests, action)
      .provide([
        [
          matchers.call.fn(groupApi.declineAllCommunityMemberRequests),
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
