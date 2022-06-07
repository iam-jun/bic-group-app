import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import declineAllCommunityMemberRequests from './declineAllCommunityMemberRequests';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';

describe('declineAllCommunityMemberRequests saga', () => {
  const communityId = 1;
  const total = 3;
  const callback = jest.fn();
  const action = {
    type: 'test',
    payload: {communityId, total, callback},
  };

  it('should decline all member requests correctly with callback function', async () => {
    return expectSaga(declineAllCommunityMemberRequests, action)
      .provide([
        [
          matchers.call.fn(groupsDataHelper.declineAllCommunityMemberRequests),
          {},
        ],
      ])
      .call(callback)
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('should call server and server throws an error', () => {
    const error = {code: 'error'};
    return expectSaga(declineAllCommunityMemberRequests, action)
      .provide([
        [
          matchers.call.fn(groupsDataHelper.declineAllCommunityMemberRequests),
          Promise.reject(error),
        ],
      ])
      .call(showError, error)
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
