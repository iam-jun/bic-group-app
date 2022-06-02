import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';
import getDiscoverCommunities from './getDiscoverCommunities';
import groupsActions from '../actions';
import {communityDetailData} from '~/test/mock_data/communities';

describe('getDiscoverCommunities saga', () => {
  const action = {type: 'test'};
  it('should get data correctly', () => {
    const state = {
      groups: {
        discoverCommunities: {
          loading: false,
          canLoadMore: true,
          list: [],
          items: {},
        },
      },
    };
    const resp = {data: [communityDetailData]};

    return expectSaga(getDiscoverCommunities, action)
      .withState(state)
      .put(groupsActions.setDiscoverCommunities({loading: true}))
      .provide([
        [matchers.call.fn(groupsDataHelper.getDiscoverCommunities), resp],
      ])
      .put(
        groupsActions.setDiscoverCommunities({
          loading: false,
          canLoadMore: false,
          list: [communityDetailData.id],
          items: {[communityDetailData.id]: communityDetailData},
        }),
      )
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('should not get data when canLoadMore = false', () => {
    const state = {
      groups: {
        discoverCommunities: {
          loading: false,
          canLoadMore: false,
          list: [],
          items: {},
        },
      },
    };
    return expectSaga(getDiscoverCommunities, action)
      .withState(state)
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(1);
      });
  });

  it('should do nothing when no data is return', () => {
    const state = {
      groups: {
        discoverCommunities: {
          loading: false,
          canLoadMore: true,
          list: [],
          items: {},
        },
      },
    };
    const resp = {};

    return expectSaga(getDiscoverCommunities, action)
      .withState(state)
      .put(groupsActions.setDiscoverCommunities({loading: true}))
      .provide([
        [matchers.call.fn(groupsDataHelper.getDiscoverCommunities), resp],
      ])
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(3);
      });
  });

  it('should call API and throws error', () => {
    const error = {code: 'error'};
    const state = {
      groups: {
        discoverCommunities: {
          loading: false,
          canLoadMore: true,
          list: [],
          items: {},
        },
      },
    };
    return expectSaga(getDiscoverCommunities, action)
      .withState(state)
      .put(groupsActions.setDiscoverCommunities({loading: true}))
      .provide([
        [
          matchers.call.fn(groupsDataHelper.getDiscoverCommunities),
          Promise.reject(error),
        ],
      ])
      .put(groupsActions.setDiscoverCommunities({loading: false}))
      .call(showError, error)
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(7);
      });
  });
});
