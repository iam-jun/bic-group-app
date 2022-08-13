import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import getPostsContainingVideoInProgress from './getPostsContainingVideoInProgress';
import postDataHelper from '../../../screens/Post/helper/PostDataHelper';
import postActions from '../actions';
import { LIST_POST_CONTAINING_VIDEO_PROCESS_1, POST_CONTAINING_VIDEO_PROCESS } from '../../../test/mock_data/draftPosts';

describe('Get Posts Containing Video In Progress Saga', () => {
  let storeData: any;

  beforeEach(() => {
    jest.clearAllMocks();

    storeData = {
      post: {
        allPostContainingVideoInProgress: {
          total: 0,
          data: [],
        },
      },
    };
  });

  it('should call the server and receive an empty list of data and list video in progress in store is = 0', async () => {
    const response = {
      data: [],
      canLoadMore: false,
      total: 0,
    };
    return expectSaga(getPostsContainingVideoInProgress, { type: 'test' })
      .provide([[matchers.call.fn(postDataHelper.getDraftPosts), response]])
      .withState(storeData)
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('should call the server and receive an list of data and list video in progress in store is = 0', async () => {
    const response = {
      data: LIST_POST_CONTAINING_VIDEO_PROCESS_1,
      canLoadMore: false,
      total: LIST_POST_CONTAINING_VIDEO_PROCESS_1.length,
    };
    return expectSaga(getPostsContainingVideoInProgress, { type: 'test' })
      .provide([[matchers.call.fn(postDataHelper.getDraftPosts), response]])
      .withState(storeData)
      .put(postActions.setAllPostContainingVideoInProgress(response))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(3);
      });
  });

  it('should call the server and receive an empty list of data and list video in progress in store is > 0', async () => {
    const response = {
      data: [],
      canLoadMore: false,
      total: 0,
    };

    storeData.post.allPostContainingVideoInProgress.data = [{ test: 1 }]
    return expectSaga(getPostsContainingVideoInProgress, { type: 'test' })
      .provide([[matchers.call.fn(postDataHelper.getDraftPosts), response]])
      .withState(storeData)
      .put(postActions.setAllPostContainingVideoInProgress({
        total: 0,
        data: [],
      }))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(3);
      });
  });

  it('should call the server and receive an list of data and list video in progress in store is > 0', async () => {
    const response = {
      data: LIST_POST_CONTAINING_VIDEO_PROCESS_1,
      canLoadMore: false,
      total: LIST_POST_CONTAINING_VIDEO_PROCESS_1.length,
    };

    storeData.post.allPostContainingVideoInProgress.data = [{ test: 1 }]

    return expectSaga(getPostsContainingVideoInProgress, { type: 'test' })
      .provide([[matchers.call.fn(postDataHelper.getDraftPosts), response]])
      .withState(storeData)
      .put(postActions.setAllPostContainingVideoInProgress(response))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(3);
      });
  });

  it('should call the server and receive an list of data and list video in progress in store is > 0 and total = 0', async () => {
    const response = {
      data: LIST_POST_CONTAINING_VIDEO_PROCESS_1,
      canLoadMore: false,
      total: LIST_POST_CONTAINING_VIDEO_PROCESS_1.length,
    };

    storeData.post.allPostContainingVideoInProgress.data = [{ id: POST_CONTAINING_VIDEO_PROCESS.id }]

    return expectSaga(getPostsContainingVideoInProgress, { type: 'test' })
      .provide([[matchers.call.fn(postDataHelper.getDraftPosts), response]])
      .withState(storeData)
      .put(postActions.setAllPostContainingVideoInProgress({ data: response.data, total: 0 }))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(3);
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

    return expectSaga(getPostsContainingVideoInProgress, { type: 'test' })
      .provide([
        [matchers.call.fn(postDataHelper.getDraftPosts), Promise.reject(error)],
      ])
      .run()
      .catch((e) => {
        expect(e).toEqual(error);
      })
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(1);
      });
  });
});
