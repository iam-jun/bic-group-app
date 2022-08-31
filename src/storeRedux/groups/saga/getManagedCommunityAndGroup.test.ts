import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { listManage } from '../../../test/mock_data/communities';
import groupsActions from '../actions';
import getManagedCommunityAndGroup from './getManagedCommunityAndGroup';
import groupApi from '../../../api/GroupApi';

describe('getManagedCommunityAndGroup saga', () => {
  const action = { type: 'test', payload: {} };

  it('should get data successfully', () => {
    const state = {
      groups: {
        managed: {
          isRefresh: false,
          owner: {
            canLoadMore: true,
            ids: [],
            items: {},
          },
          manage: {
            isLoading: false,
            canLoadMore: true,
            ids: [],
            items: {},
          },
        },
      },
    };
    const resp = { data: [...listManage], meta: { hasNextPage: false } };

    const newIds = resp.data.map((item) => item.id);
    const newItems = resp.data.reduce((accumulator, currentItem) => ({
      ...accumulator,
      [currentItem.id]: currentItem,
    }), {});

    return expectSaga(getManagedCommunityAndGroup, action)
      .withState(state)
      .put(groupsActions.setManaged({
        isRefresh: undefined,
        manage: {
          ...state.groups.managed.manage,
          isLoading: true,
        },
      }))
      .provide([
        [matchers.call.fn(groupApi.getManagedCommunityAndGroup), resp],
      ])
      .put(
        groupsActions.setManaged({
          manage: {
            ...state.groups.managed.manage,
            isLoading: false,
            canLoadMore: resp.meta.hasNextPage,
            ids: newIds,
            items: newItems,
          },
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
