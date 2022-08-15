import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import runSearch from './runSearch';
import streamApi from '../../../../../api/StreamApi';
import actions from '../actions';
import { MENTION_USER } from '~/test/mock_data/mention';

describe('_MentionInput Saga', () => {
  it('runSearch should be called to server successfully with search content', () => {
    const action = {
      type: 'test',
      payload: {},
    };
    const state = { mentionInput: { fullContent: '@quyen' } };
    return expectSaga(runSearch, action)
      .withState(state)
      .provide([
        [
          matchers.call.fn(streamApi.getSearchMentionAudiences),
          { data: [MENTION_USER] },
        ],
      ])
      .put(actions.setData([MENTION_USER]))
      .run();
  });

  it('runSearch should set empty data if full content is empty', () => {
    const action = {
      type: 'test',
      payload: {},
    };
    const state = { mentionInput: { fullContent: '' } };
    return expectSaga(runSearch, action)
      .withState(state)
      .provide([
        [
          matchers.call.fn(streamApi.getSearchMentionAudiences),
          { data: [MENTION_USER] },
        ],
      ])
      .put(actions.setData([]))
      .run();
  });

  it('runSearch should be called to server failure', () => {
    const action = {
      type: 'test',
      payload: {},
    };
    return expectSaga(runSearch, action)
      .provide([
        [matchers.call.fn(streamApi.getSearchMentionAudiences), null],
      ])
      .put(actions.setData([]))
      .run();
  });

  it('runSearch should be called to server with error', () => {
    const action = {
      type: 'test',
      payload: {},
    };
    return expectSaga(runSearch, action)
      .provide([
        [
          matchers.call.fn(streamApi.getSearchMentionAudiences),
          throwError(new Error('empty data')),
        ],
      ])
      .put(actions.setLoading(false))
      .run();
  });
});
