import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import modalActions from '~/store/modal/actions';

import { baseCommentData } from '~/test/mock_data/post';
import postDataHelper from '../../helper/PostDataHelper';
import postActions from '../actions';
import putReactionToComment from './putReactionToComment';

describe('Update Reaction Of Comment By Id saga', () => {
  let storeData: any;

  beforeEach(() => {
    jest.clearAllMocks();

    storeData = {
      post: {
        allComments: {
          490: {
            ...baseCommentData,
          },
        },
      },
    };
  });

  function allCommentsReducer(state = storeData, action: {type: string}) {
    if (action.type === 'test') {
      return {
        ...state,
      };
    }

    return state;
  }

  it('should put reaction to comment successfully with required params in the payload', () => {
    const actionTest = {
      type: 'test',
      payload: {
        id: baseCommentData.id,
        comment: {},
        postId: baseCommentData.postId,
        reactionId: 'smiley',
      },
    };

    const response = {
      data: {
        actor: {
          id: 58,
          username: 'thuquyen',
          fullname: 'Nguyen Thi Thu Quyền',
          avatar:
            'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
          email: 'thuquyen@tgm.vn',
        },
        id: 69,
        reactionName: 'smiley',
        createdAt: '2022-05-09T11:05:00.023Z',
      },
      meta: {
        message: 'OK',
      },
    };

    const newAllComments = {
      490: {
        ...baseCommentData,
        reactionsCount: { 1: { smiley: 1 } },
        ownerReactions: [{ ...response.data }],
      },
    };

    return (
      // @ts-ignorets
      expectSaga(putReactionToComment, actionTest)
        .withReducer(allCommentsReducer)
        .put(postActions.setAllComments(storeData.post.allComments))
        .provide([[matchers.call.fn(postDataHelper.putReaction), response]])
        .put(postActions.setAllComments(newAllComments))
        .run()
    );
  });

  it('should do nothing when postId is undefined/null/0 on payload', () => {
    const action = {
      type: 'test',
      payload: {
        id: baseCommentData.id,
        comment: {},
        postId: 0,
        reactionId: 'smiley',
      },
    };

    return (
      // @ts-ignorets
      expectSaga(putReactionToComment, action)
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(0);
        })
    );
  });

  it('should do nothing when this icon is added by user', () => {
    const action = {
      type: 'test',
      payload: {
        id: baseCommentData.id,
        comment: {},
        postId: baseCommentData.postId,
        reactionId: 'smiley',
      },
    };

    const newStoreData = {
      post: {
        allComments: {
          490: {
            ...baseCommentData,
            reactionsCount: { 1: { smiley: 1 } },
            ownerReactions: [
              {
                actor: {
                  id: 58,
                  username: 'thuquyen',
                  fullname: 'Nguyen Thi Thu Quyền',
                  avatar:
                    'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
                  email: 'thuquyen@tgm.vn',
                },
                id: 69,
                reactionName: 'smiley',
                createdAt: '2022-05-09T11:05:00.023Z',
              },
            ],
          },
        },
      },
    };

    return (
      // @ts-ignorets
      expectSaga(putReactionToComment, action)
        .withState(newStoreData)
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(1);
        })
    );
  });

  it('should +1 reactionsCount when this icon is added first by user', () => {
    const action = {
      type: 'test',
      payload: {
        id: baseCommentData.id,
        comment: {},
        postId: baseCommentData.postId,
        reactionId: 'smiley',
      },
    };

    const newStoreData = {
      post: {
        allComments: {
          490: {
            ...baseCommentData,
            reactionsCount: { 1: { test: 1 } },
            ownerReactions: [],
          },
        },
      },
    };

    const response = {
      data: {
        actor: {
          id: 58,
          username: 'thuquyen',
          fullname: 'Nguyen Thi Thu Quyền',
          avatar:
            'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/3849e4fc-941f-4b2a-bce9-9da2069a2e55.jpg',
          email: 'thuquyen@tgm.vn',
        },
        id: 69,
        reactionName: 'smiley',
        createdAt: '2022-05-09T11:05:00.023Z',
      },
      meta: {
        message: 'OK',
      },
    };

    const newAllComments = {
      490: {
        ...baseCommentData,
        reactionsCount: { 1: { test: 1 }, 2: { smiley: 1 } },
        ownerReactions: [{ ...response.data }],
      },
    };

    return (
      // @ts-ignorets
      expectSaga(putReactionToComment, action)
        .withReducer(allCommentsReducer, newStoreData)
        .put(postActions.setAllComments(newStoreData.post.allComments))
        .provide([[matchers.call.fn(postDataHelper.putReaction), response]])
        .put(postActions.setAllComments(newAllComments))
        .run()
    );
  });

  it('call server mark as read api exception', () => {
    const action = {
      type: 'test',
      payload: {
        id: baseCommentData.id,
        comment: {},
        postId: baseCommentData.postId,
        reactionId: 'smiley',
      },
    };

    const resp = {
      code: 'server_internal_error',
      data: null,
      meta: {
        message: 'Not a valid JWT token',
      },
    };

    return (
      // @ts-ignorets
      expectSaga(putReactionToComment, action)
        .withReducer(allCommentsReducer)
        .put(postActions.setAllComments(storeData.post.allComments))
        .provide([
          [matchers.call.fn(postDataHelper.putReaction), Promise.reject(resp)],
        ])
        .put(postActions.setAllComments(storeData.post.allComments))
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
