import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import runSearch from './runSearch';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import actions from '../actions';
import {throwError} from 'redux-saga-test-plan/providers';

describe('_MentionInput Saga', () => {
  it('runSearch should be called to server successfully', () => {
    const action = {
      type: 'test',
      payload: {},
    };
    return expectSaga(runSearch, action)
      .provide([
        [
          matchers.call.fn(postDataHelper.getSearchMentionAudiences),
          {data: []},
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
        [matchers.call.fn(postDataHelper.getSearchMentionAudiences), null],
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
          matchers.call.fn(postDataHelper.getSearchMentionAudiences),
          throwError(new Error('empty data')),
        ],
      ])
      .put(actions.setLoading(false))
      .run();
  });
});
