import {expectSaga} from 'redux-saga-test-plan';

import {baseCommentData, POST_DETAIL_3} from '~/test/mock_data/post';
import {
  UPDATE_REACTION_TO_POST_DATA_1,
  UPDATE_REACTION_TO_POST_DATA_2,
  UPDATE_REACTION_TO_COMMENT_DATA_1,
  UPDATE_REACTION_TO_COMMENT_DATA_2,
  UPDATE_REACTION_TO_CHILD_COMMENT_DATA_1,
  UPDATE_REACTION_TO_CHILD_COMMENT_DATA_2,
} from '~/test/mock_data/socketPayload';
import postActions from '../actions';
import updateReactionBySocket from './updateReactionBySocket';

describe('Update Reaction by socket saga', () => {
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
        allPosts: {
          302: {...POST_DETAIL_3},
        },
      },
    };
  });

  it('should update reactionsCount and ownerReactions when user react to their post by socket successfully with required params in the payload', () => {
    const action = {
      type: 'test',
      payload: {
        userId: 33,
        data: UPDATE_REACTION_TO_POST_DATA_1,
      },
    };

    const newPost = {
      ...POST_DETAIL_3,
      reactionsCount: {
        '0': {thumbsup: 1},
      },
      ownerReactions: UPDATE_REACTION_TO_POST_DATA_1.reactionsOfActor,
    };

    return (
      // @ts-ignorets
      expectSaga(updateReactionBySocket, action)
        .withState(storeData)
        .withState(storeData)
        .put(
          postActions.addToAllPosts({
            data: newPost as any,
          }),
        )
        .run()
        .then(({allEffects}: any) => {
          expect(allEffects?.length).toEqual(3);
        })
    );
  });

  it('should update reactionsCount when someone reacts to their post by socket successfully with required params in the payload', () => {
    const action = {
      type: 'test',
      payload: {
        userId: 33,
        data: {
          ...UPDATE_REACTION_TO_POST_DATA_2,
        },
      },
    };

    const newPost = {
      ...POST_DETAIL_3,
      reactionsCount: UPDATE_REACTION_TO_POST_DATA_2.reactionsCount,
      ownerReactions: storeData.post.allPosts[302].ownerReactions,
    };

    return (
      // @ts-ignorets
      expectSaga(updateReactionBySocket, action)
        .withState(storeData)
        .withState(storeData)
        .put(
          postActions.addToAllPosts({
            data: newPost as any,
          }),
        )
        .run()
        .then(({allEffects}: any) => {
          expect(allEffects?.length).toEqual(3);
        })
    );
  });

  it('should update reactionsCount and ownerReactions when user react to their comment by socket successfully with required params in the payload', () => {
    const action = {
      type: 'test',
      payload: {
        userId: 33,
        data: {
          ...UPDATE_REACTION_TO_COMMENT_DATA_1,
        },
      },
    };

    const newAllComments = {
      490: {
        ...baseCommentData,
        reactionsCount:
          UPDATE_REACTION_TO_COMMENT_DATA_1.comment.reactionsCount,
        ownerReactions:
          UPDATE_REACTION_TO_COMMENT_DATA_1.comment.reactionsOfActor,
      },
    };

    return (
      // @ts-ignorets
      expectSaga(updateReactionBySocket, action)
        .withState(storeData)
        .withState(storeData)
        .put(postActions.setAllComments(newAllComments))
        .run()
        .then(({allEffects}: any) => {
          expect(allEffects?.length).toEqual(3);
        })
    );
  });

  it(`should update reactionsCount when Other users react to the user's comment`, () => {
    const action = {
      type: 'test',
      payload: {
        userId: 33,
        data: {
          ...UPDATE_REACTION_TO_COMMENT_DATA_2,
        },
      },
    };

    const newAllComments = {
      490: {
        ...baseCommentData,
        reactionsCount:
          UPDATE_REACTION_TO_COMMENT_DATA_2.comment.reactionsCount,
      },
    };

    return (
      // @ts-ignorets
      expectSaga(updateReactionBySocket, action)
        .withState(storeData)
        .withState(storeData)
        .put(postActions.setAllComments(newAllComments))
        .run()
        .then(({allEffects}: any) => {
          expect(allEffects?.length).toEqual(3);
        })
    );
  });

  it('should update reactionsCount and ownerReactions when user react to their child comment by socket successfully with required params in the payload', () => {
    const action = {
      type: 'test',
      payload: {
        userId: 33,
        data: {
          ...UPDATE_REACTION_TO_CHILD_COMMENT_DATA_1,
        },
      },
    };
    const newStoreData = {
      post: {
        allComments: {
          490: {
            ...baseCommentData,
          },
          505: {...baseCommentData.child.list[0]},
        },
      },
    };

    const newComment = {
      ...baseCommentData.child.list[0],
      reactionsCount:
        UPDATE_REACTION_TO_CHILD_COMMENT_DATA_1.comment.child.reactionsCount,
      ownerReactions:
        UPDATE_REACTION_TO_CHILD_COMMENT_DATA_1.comment.child.reactionsOfActor,
    };

    const newAllComments = {
      490: {
        ...baseCommentData,
      },
      505: {...newComment},
    };

    return (
      // @ts-ignorets
      expectSaga(updateReactionBySocket, action)
        .withState(newStoreData)
        .withState(newStoreData)
        .put(postActions.setAllComments(newAllComments))
        .run()
        .then(({allEffects}: any) => {
          expect(allEffects?.length).toEqual(3);
        })
    );
  });

  it(`should update reactionsCount when Other users react to the user's child comment`, () => {
    const action = {
      type: 'test',
      payload: {
        userId: 33,
        data: {
          ...UPDATE_REACTION_TO_CHILD_COMMENT_DATA_2,
        },
      },
    };

    const newStoreData = {
      post: {
        allComments: {
          490: {
            ...baseCommentData,
          },
          505: {...baseCommentData.child.list[0]},
        },
      },
    };

    const newComment = {
      ...baseCommentData.child.list[0],
      reactionsCount:
        UPDATE_REACTION_TO_CHILD_COMMENT_DATA_1.comment.child.reactionsCount,
    };

    const newAllComments = {
      490: {
        ...baseCommentData,
      },
      505: {...newComment},
    };

    return (
      // @ts-ignorets
      expectSaga(updateReactionBySocket, action)
        .withState(newStoreData)
        .withState(newStoreData)
        .put(postActions.setAllComments(newAllComments))
        .run()
        .then(({allEffects}: any) => {
          expect(allEffects?.length).toEqual(3);
        })
    );
  });
});
