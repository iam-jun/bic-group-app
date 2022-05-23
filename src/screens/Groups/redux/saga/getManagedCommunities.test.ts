import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import actions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import getManagedCommunities from './getManagedCommunities';
import {communityDetailData} from '~/test/mock_data/communities';
import showError from '~/store/commonSaga/showError';

describe('Get managed communities saga', () => {
  const action = {type: 'test'};

  it('should get data successfully', () => {
    const state = {
      groups: {managedCommunities: {data: [], items: {}, canLoadMore: true}},
    };
    const resp = {...communityDetailData};

    return expectSaga(getManagedCommunities, action)
      .withState(state)
      .put(actions.setManagedCommunities({loading: true}))
      .provide([
        [matchers.call.fn(groupsDataHelper.getJoinedCommunities), [resp]],
      ])
      .put(
        actions.setManagedCommunities({
          loading: false,
          data: [resp.id],
          items: {[resp.id]: resp},
          canLoadMore: false,
        }),
      )
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('should NOT call API when canLoadMore = false', () => {
    const state = {
      groups: {managedCommunities: {data: [1], items: {}, canLoadMore: false}},
    };
    return expectSaga(getManagedCommunities, action)
      .withState(state)
      .put(actions.setManagedCommunities({loading: false}))
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('should call server and throws error', () => {
    const state = {
      groups: {managedCommunities: {data: [], items: {}, canLoadMore: true}},
    };
    const error = {code: 'error'};

    return expectSaga(getManagedCommunities, action)
      .withState(state)
      .provide([
        [
          matchers.call.fn(groupsDataHelper.getJoinedCommunities),
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
