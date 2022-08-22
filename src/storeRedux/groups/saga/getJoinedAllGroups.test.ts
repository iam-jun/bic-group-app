import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { listYourGroups } from '../../../test/mock_data/communities';
import groupsActions from '../actions';
import getJoinedAllGroups from './getJoinedAllGroups';
import groupApi from '../../../api/GroupApi';

describe('getJoinedAllGroups saga', () => {
  const action = { type: 'test', payload: {} };

  it('should get data successfully', () => {
    const state = {
      groups: {
        joinedAllGroups: {
          isRefresh: false,
          isLoading: false,
          canLoadMore: true,
          ids: [],
          items: {},
        },
      },
    };
    const resp = { data: [...listYourGroups], meta: { hasNextPage: false } };

    const newIds = resp.data.map((item) => item.id);
    const newItems = resp.data.reduce((accumulator, currentItem) => ({
      ...accumulator,
      [currentItem.id]: currentItem,
    }), {});

    return expectSaga(getJoinedAllGroups, action)
      .withState(state)
      .put(groupsActions.setJoinedAllGroups({ isLoading: true, isRefresh: undefined }))
      .provide([
        [matchers.call.fn(groupApi.getJoinedAllGroups), resp],
      ])
      .put(
        groupsActions.setJoinedAllGroups({

          isRefresh: false,
          isLoading: false,
          canLoadMore: resp.meta.hasNextPage,
          ids: newIds,
          items: newItems,

        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
