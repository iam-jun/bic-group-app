import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import getCommunityDetail from './getCommunityDetail';
import actions from '../actions';
import groupApi from '../../../api/GroupApi';
import { ICommunity } from '../../../interfaces/ICommunity';

describe('get Community Detail saga', () => {
  const action = {
    type: 'test',
    payload: { communityId: 1, loadingPage: false },
  };

  it('should get community details successfully', () => {
    const resp = { data: { join_status: 2 } as ICommunity };

    return expectSaga(getCommunityDetail, action)
      .provide([[matchers.call.fn(groupApi.getCommunityDetail), resp]])
      .put(actions.setCommunityDetail(resp?.data))
      .run();
  });

  it('should call server and server throws an error', () => expectSaga(getCommunityDetail, action)
    .provide([
      [
        matchers.call.fn(groupApi.getCommunityDetail),
        Promise.reject(),
      ],
    ])
    .put(actions.setCommunityDetail({} as ICommunity))
    .run());
});
