import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import homeActions from '../actions';
import getRecentSearchKeywords from './getRecentSearchKeywords';
import streamApi from '../../../api/StreamApi';

describe('Search Post Saga', () => {
  it('call server get recent search keywords success', async () => {
    const action = { type: 'test', payload: {} };
    return expectSaga(getRecentSearchKeywords, action)
      .provide([
        [matchers.call.fn(streamApi.getRecentSearchKeywords), null],
      ])
      .put(homeActions.setNewsfeedSearchRecentKeywords({ loading: true }))
      .put(
        homeActions.setNewsfeedSearchRecentKeywords({ data: [], loading: false }),
      )
      .run();
  });
  it('call server get recent search keywords success without show loading', async () => {
    const action = { type: 'test', payload: { showLoading: false } };
    return expectSaga(getRecentSearchKeywords, action)
      .provide([
        [matchers.call.fn(streamApi.getRecentSearchKeywords), null],
      ])
      .put(
        homeActions.setNewsfeedSearchRecentKeywords({ data: [], loading: false }),
      )
      .run();
  });
  it('call server get recent search keywords error', async () => {
    const action = { type: 'test', payload: {} };
    return expectSaga(getRecentSearchKeywords, action)
      .provide([
        [
          matchers.call.fn(streamApi.getRecentSearchKeywords),
          throwError(new Error('empty data')),
        ],
      ])
      .put(homeActions.setNewsfeedSearchRecentKeywords({ loading: true }))
      .put(homeActions.setNewsfeedSearchRecentKeywords({ loading: false }))
      .run();
  });
});
