/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import actions from '../actions';
import groupApi from '../../../api/GroupApi';
import getManagedCommunities from './getManagedCommunities';
import { communityDetailData } from '../../../test/mock_data/communities';
import showError from '../../commonSaga/showError';
import { ICommunity } from '../../../interfaces/ICommunity';
import { mapItems } from '../../../screens/groups/helper/mapper';

describe('Get managed communities saga', () => {
  const action = { type: 'test', payload: {} };

  it('should get data successfully', () => {
    const state = {
      groups: { managedCommunities: { ids: [], items: {}, canLoadMore: true } },
    };
    const resp = { data: [{ ...communityDetailData }] };

    // @ts-ignore
    const newIds = resp.data.map((item: ICommunity) => item.id);
    const newItems = mapItems(resp.data as any);

    return expectSaga(getManagedCommunities, action)
      .withState(state)
      .put(actions.setManagedCommunities({ loading: true }))
      .provide([
        [matchers.call.fn(groupApi.getJoinedCommunities), resp],
      ])
      .put(
        actions.setManagedCommunities({
          loading: false,
          ids: [...newIds],
          items: { ...newItems },
          canLoadMore: false,
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('should NOT call API when canLoadMore = false', () => {
    const state = {
      groups: { managedCommunities: { ids: [1], items: {}, canLoadMore: false } },
    };
    return expectSaga(getManagedCommunities, action)
      .withState(state)
      .put(actions.setManagedCommunities({ loading: false }))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('should call server and throws error', () => {
    const state = {
      groups: { managedCommunities: { ids: [], items: {}, canLoadMore: true } },
    };
    const error = { code: 'error' };

    return expectSaga(getManagedCommunities, action)
      .withState(state)
      .put(actions.setManagedCommunities({ loading: false }))
      .provide([
        [
          matchers.call.fn(groupApi.getJoinedCommunities),
          Promise.reject(error),
        ],
      ])
      .call(showError, error)
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(7);
      });
  });
});
