import { cloneDeep } from 'lodash';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import modalActions from '~/store/modal/actions';

import { POST_DETAIL } from '~/test/mock_data/post';
import postDataHelper from '../../helper/PostDataHelper';
import postActions from '../actions';
import putReactionToPost from './putReactionToPost';

describe('Update Reaction to Post By Id saga', () => {
  let storeData: any;

  beforeEach(() => {
    jest.clearAllMocks();

    storeData = {
      post: {
        allPosts: {
          28: {
            ...POST_DETAIL,
          },
        },
      },
    };
  });

  // eslint-disable-next-line default-param-last
  function allCommentsReducer(state = storeData, action: {type: string}) {
    if (action.type === 'test') {
      return {
        ...state,
      };
    }

    return state;
  }

  it('call server mark as read api exception', () => {
    const actionTest = {
      type: 'test',
      payload: {
        id: POST_DETAIL.id,
        reactionId: 'smiley',
        ownReaction: POST_DETAIL.ownerReactions,
        reactionCounts: POST_DETAIL.reactionsCount,
      },
    };

    const resp = {
      code: 'server_internal_error',
      data: null,
      meta: {
        message: 'Not a valid JWT token',
      },
    };

    const newOwnReaction = cloneDeep(POST_DETAIL.ownerReactions);

    const newPost1 = {
      ...POST_DETAIL,
      reactionsCount: { ...POST_DETAIL.reactionsCount, 2: { smiley: 1 } },
      ownerReactions: [
        ...newOwnReaction,
        { reactionName: 'smiley', loading: true },
      ],
    };

    return (
      // @ts-ignorets
      expectSaga(putReactionToPost, actionTest)
        .withReducer(allCommentsReducer)
        .put(postActions.addToAllPosts({ data: newPost1 as any }))
        .provide([
          [matchers.call.fn(postDataHelper.putReaction), Promise.reject(resp)],
        ])
        .put(postActions.addToAllPosts({ data: storeData.post.allPosts[28] }))
        .put(
          modalActions.showHideToastMessage({
            content: resp.meta.message,
            props: {
              textProps: { useI18n: true },
              type: 'error',
            },
          }),
        )
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(7);
        })
    );
  });
});
