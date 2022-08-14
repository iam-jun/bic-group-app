import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { memberRequestDetail } from '../../../test/mock_data/communities';
import initialState from '../../initialState';

import groupApi from '../../../api/GroupApi';
import showError from '../../commonSaga/showError';
import getCommunityMemberRequests from './getCommunityMemberRequests';
import groupsActions from '../actions';

describe('getCommunityMemberRequests saga', () => {
  const communityId = 1;
  const action = { type: 'test', payload: { communityId } };

  it('should get data correctly', async () => {
    const state = { ...initialState };
    const resp = { data: [memberRequestDetail], meta: { total: 1 } };

    return expectSaga(getCommunityMemberRequests, action)
      .withState(state)
      .put(groupsActions.setCommunityMemberRequests({ loading: true }))
      .provide([
        [matchers.call.fn(groupApi.getCommunityMemberRequests), resp],
      ])
      .put(
        groupsActions.setCommunityMemberRequests({
          total: 1,
          loading: false,
          canLoadMore: false,
          ids: [memberRequestDetail.id],
          items: { [memberRequestDetail.id]: { ...memberRequestDetail } },
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('should not get data when canLoadMore = false', async () => {
    const state = { ...initialState };
    state.groups.communityMemberRequests.canLoadMore = false;

    return expectSaga(getCommunityMemberRequests, action)
      .withState(state)
      .put(groupsActions.setCommunityMemberRequests({ loading: true }))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('should call API and throws error', async () => {
    const error = { code: 'error' };
    const state = { ...initialState };
    state.groups.communityMemberRequests.canLoadMore = true;
    return expectSaga(getCommunityMemberRequests, action)
      .withState(state)
      .put(groupsActions.setCommunityMemberRequests({ loading: true }))
      .provide([
        [
          matchers.call.fn(groupApi.getCommunityMemberRequests),
          Promise.reject(error),
        ],
      ])
      .call(showError, error)
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(6);
      });
  });
});
