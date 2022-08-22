import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { listOwnCommunity } from '../../../test/mock_data/communities';
import groupsActions from '../actions';
import getOwnerCommunity from './getOwnerCommunity';
import groupApi from '../../../api/GroupApi';

describe('getOwnerCommunity saga', () => {
  it('should get data successfully', () => {
    const resp = { data: [...listOwnCommunity], meta: { hasNextPage: false } };

    const newIds = resp.data.map((item) => item.id);
    const newItems = resp.data.reduce(
      (accumulator, currentItem) => ({
        ...accumulator,
        [currentItem.id]: currentItem,
      }),
      {},
    );

    return expectSaga(getOwnerCommunity)
      .provide([[matchers.call.fn(groupApi.getOwnerCommunity), resp]])
      .put(
        groupsActions.setManaged({
          owner: {
            canLoadMore: false,
            ids: newIds,
            items: newItems,
          },
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });
});
