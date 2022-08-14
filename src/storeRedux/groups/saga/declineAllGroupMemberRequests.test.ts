import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import declineAllGroupMemberRequests from './declineAllGroupMemberRequests';
import groupApi from '../../../api/GroupApi';
import showError from '../../commonSaga/showError';

describe('declineAllGroupMemberRequests saga', () => {
  const groupId = 1;
  const action = {
    type: 'test',
    payload: { groupId },
  };

  it('should decline all member requests correctly', async () => expectSaga(declineAllGroupMemberRequests, action)
    .provide([
      [matchers.call.fn(groupApi.declineAllGroupMemberRequests), {}],
    ])
    .run()
    .then(({ allEffects }: any) => {
      expect(allEffects?.length).toEqual(1);
    }));

  it('should call server and server throws an error', async () => {
    const error = { code: 'error' };
    return expectSaga(declineAllGroupMemberRequests, action)
      .provide([
        [
          matchers.call.fn(groupApi.declineAllGroupMemberRequests),
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
