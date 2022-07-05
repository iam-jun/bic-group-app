import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import updatePostsContainingVideoInProgress from './updatePostsContainingVideoInProgress';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import postActions from '~/screens/Post/redux/actions';
import {LIST_POST_CONTAINING_VIDEO_PROCESS_1} from '~/test/mock_data/draftPosts';
import {
  ATTACH_NOTIFICATION_FAILED,
  ATTACH_NOTIFICATION_PUBLISHED,
} from '~/test/mock_data/notifications';
import homeActions from '~/screens/Home/redux/actions';

describe('Update Posts Containing Video In Progress Saga', () => {
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
      home: {homePosts: []},
    };
  });

  it('should do nothing if can not find allPostContainingVideoInProgress in redux state', async () => {
    storeData.allPostContainingVideoInProgress = null;
    return expectSaga(updatePostsContainingVideoInProgress, {
      type: 'test',
      payload: {...ATTACH_NOTIFICATION_PUBLISHED},
    })
      .withState(storeData)
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(1);
      });
  });

  it('should do nothing if not found postId in notification item in list post containing video in progress', async () => {
    return expectSaga(updatePostsContainingVideoInProgress, {
      type: 'test',
      payload: {...ATTACH_NOTIFICATION_PUBLISHED},
    })
      .withState(storeData)
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(1);
      });
  });

  it('should update list post containing video in progress when found postId in notification item in list post containing video in progress', async () => {
    storeData.post.allPostContainingVideoInProgress = {
      total: LIST_POST_CONTAINING_VIDEO_PROCESS_1.length,
      data: LIST_POST_CONTAINING_VIDEO_PROCESS_1,
    };
    return expectSaga(updatePostsContainingVideoInProgress, {
      type: 'test',
      payload: {...ATTACH_NOTIFICATION_FAILED},
    })
      .withState(storeData)
      .put(
        postActions.setAllPostContainingVideoInProgress({total: 0, data: []}),
      )
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('should update list post containing video in progress and add this post to homePost when found postId in notification item in list post containing video in progress and this post is published', async () => {
    storeData.post.allPostContainingVideoInProgress = {
      total: LIST_POST_CONTAINING_VIDEO_PROCESS_1.length,
      data: LIST_POST_CONTAINING_VIDEO_PROCESS_1,
    };

    return expectSaga(updatePostsContainingVideoInProgress, {
      type: 'test',
      payload: {...ATTACH_NOTIFICATION_PUBLISHED},
    })
      .withState(storeData)
      .put(
        postActions.setAllPostContainingVideoInProgress({total: 0, data: []}),
      )
      .withState(storeData)
      .put(
        homeActions.setHomePosts([
          ATTACH_NOTIFICATION_PUBLISHED.activities[0],
        ] as any),
      )
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
