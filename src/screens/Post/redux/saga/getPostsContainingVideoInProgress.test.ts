import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import getPostsContainingVideoInProgress from './getPostsContainingVideoInProgress';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import postActions from '~/screens/Post/redux/actions';
import {LIST_POST_CONTAINING_VIDEO_PROCESS_1} from '~/test/mock_data/draftPosts';

describe('Get Posts Containing Video In Progress Saga', () => {
  it('should call the server and receive an empty list of data', async () => {
    const response = {
      data: [],
      canLoadMore: false,
      total: 0,
    };
    return expectSaga(getPostsContainingVideoInProgress, {
      type: 'test',
      payload: {},
    })
      .provide([[matchers.call.fn(postDataHelper.getDraftPosts), response]])
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(1);
      });
  });

  it('should call the server and receive an list of data', async () => {
    const response = {
      data: LIST_POST_CONTAINING_VIDEO_PROCESS_1,
      canLoadMore: false,
      total: LIST_POST_CONTAINING_VIDEO_PROCESS_1.length,
    };
    return expectSaga(getPostsContainingVideoInProgress, {
      type: 'test',
      payload: {},
    })
      .provide([[matchers.call.fn(postDataHelper.getDraftPosts), response]])
      .put(postActions.setAllPostContainingVideoInProgress(response))
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('call server get list draft post failed', () => {
    const error = {
      code: 10000,
      data: null,
      meta: {
        errors: [
          {
            message: 'ERROR',
            title: 'Bad Request',
          },
        ],
        message: 'Bad Request',
      },
    };

    return expectSaga(getPostsContainingVideoInProgress, {
      type: 'test',
      payload: {},
    })
      .provide([
        [matchers.call.fn(postDataHelper.getDraftPosts), Promise.reject(error)],
      ])
      .run()
      .catch(e => {
        expect(e).toEqual(error);
      })
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(1);
      });
  });
});
