import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import {communityDetailData} from '~/test/mock_data/communities';
import getCommunitySearch from './getCommunitySearch';
import actions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';

describe('getCommunitySearch', () => {
  const action = {
    type: 'test',
    payload: {},
  };

  it('should get data correctly', async () => {
    const resp = [communityDetailData];

    const state = {
      groups: {
        communitySearch: {
          loading: false,
          canLoadMore: true,
          ids: [],
          items: {},
        },
      },
    };

    return expectSaga(getCommunitySearch, action)
      .withState(state)
      .put(actions.setCommunitySearch({loading: true}))
      .provide([[matchers.call.fn(groupsDataHelper.getCommunities), resp]])
      .put(
        actions.setCommunitySearch({
          loading: false,
          canLoadMore: false,
          ids: [communityDetailData.id],
          items: {[communityDetailData.id]: {...communityDetailData}},
        }),
      )
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('should NOT call API when canLoadMore = false', async () => {
    const state = {
      groups: {
        communitySearch: {
          loading: false,
          canLoadMore: false,
          ids: [],
          items: {},
        },
      },
    };
    return expectSaga(getCommunitySearch, action)
      .withState(state)
      .put(actions.setCommunitySearch({loading: true}))
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('should call server and throws error', async () => {
    const error = {code: 1};
    const state = {
      groups: {
        communitySearch: {
          loading: false,
          canLoadMore: true,
          data: [],
        },
      },
    };

    return expectSaga(getCommunitySearch, action)
      .withState(state)
      .put(actions.setCommunitySearch({loading: true}))
      .provide([
        [
          matchers.call.fn(groupsDataHelper.getCommunities),
          Promise.reject(error),
        ],
      ])
      .call(showError, error)
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(6);
      });
  });
});
