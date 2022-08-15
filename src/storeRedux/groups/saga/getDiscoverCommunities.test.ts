import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import groupApi from '../../../api/GroupApi';
import showError from '../../commonSaga/showError';
import getDiscoverCommunities from './getDiscoverCommunities';
import groupsActions from '../actions';
import { communityDetailData } from '../../../test/mock_data/communities';

describe('getDiscoverCommunities saga', () => {
  const action = { type: 'test', payload: {} };

  it('should get data correctly', async () => {
    const state = {
      groups: {
        discoverCommunities: {
          loading: false,
          canLoadMore: true,
          ids: [],
          items: {},
        },
      },
    };
    const resp = { data: [communityDetailData] };

    return expectSaga(getDiscoverCommunities, action)
      .withState(state)
      .put(groupsActions.setDiscoverCommunities({ loading: true }))
      .provide([
        [matchers.call.fn(groupApi.getDiscoverCommunities), resp],
      ])
      .put(
        groupsActions.setDiscoverCommunities({
          loading: false,
          canLoadMore: false,
          ids: [communityDetailData.id],
          items: { [communityDetailData.id]: communityDetailData },
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('should not get data when canLoadMore = false', async () => {
    const state = {
      groups: {
        discoverCommunities: {
          loading: false,
          canLoadMore: false,
          ids: [],
          items: {},
        },
      },
    };
    return expectSaga(getDiscoverCommunities, action)
      .withState(state)
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('should refresh data when isRefreshing = true', async () => {
    const action = { type: 'test', payload: { isRefreshing: true } };
    const state = {
      groups: {
        discoverCommunities: {
          loading: false,
          canLoadMore: false,
          ids: [],
          items: {},
        },
      },
    };
    const resp = { data: [communityDetailData] };

    return expectSaga(getDiscoverCommunities, action)
      .withState(state)
      .put(groupsActions.setDiscoverCommunities({ loading: true }))
      .provide([
        [matchers.call.fn(groupApi.getDiscoverCommunities), resp],
      ])
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('should call API and throws error', async () => {
    const error = { code: 'error' };
    const state = {
      groups: {
        discoverCommunities: {
          loading: false,
          canLoadMore: true,
          ids: [],
          items: {},
        },
      },
    };
    return expectSaga(getDiscoverCommunities, action)
      .withState(state)
      .put(groupsActions.setDiscoverCommunities({ loading: true }))
      .provide([
        [
          matchers.call.fn(groupApi.getDiscoverCommunities),
          Promise.reject(error),
        ],
      ])
      .put(groupsActions.setDiscoverCommunities({ loading: false }))
      .call(showError, error)
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(7);
      });
  });
});
