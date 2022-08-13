/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expectSaga } from 'redux-saga-test-plan';
import { IReaction } from '~/interfaces/IPost';

import { baseCommentData } from '~/test/mock_data/post';
import postActions from '../actions';
import onUpdateReactionOfCommentById from './onUpdateReactionOfCommentById';

describe('Update Reaction Of Comment By Id saga', () => {
  const commentId = baseCommentData.id;
  const storeData = {
    post: {
      allComments: {
        490: { ...baseCommentData },
      },
    },
  };

  it('should update reaction of comment by id successfully with required params in the payload', () => {
    const action = {
      reactionsCount: { 0: { smiley: 1 }, 1: { grin: 1 } },
      ownerReactions: [
        {
          id: 0,
          reactionName: 'grin',
          createdBy: 0,
        },
      ],
    };

    const newComment = {
      ...baseCommentData,
      reactionsCount: action.reactionsCount,
      ownerReactions: action.ownerReactions,
    };
    const newAllComments = {
      490: { ...newComment },
    };

    return (
      // @ts-ignorets
      expectSaga(
        onUpdateReactionOfCommentById,
        commentId,
        [
          {
            id: '0',
            reactionName: 'grin',
            createdBy: 0,
          } as IReaction,
        ],
        { 0: { smiley: 1 }, 1: { grin: 1 } },
      )
        .withState(storeData)
      // @ts-ignorets
        .put(postActions.setAllComments(newAllComments))
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(2);
        })
    );
  });

  it('should update reaction of comment by id if not found comment in state and have defaultComment in payload', () => {
    const newStore = {
      post: {
        allComments: {},
      },
    };
    const action = {
      reactionsCount: { 0: { smiley: 1 }, 1: { grin: 1 } },
      ownerReactions: [
        {
          id: 0,
          reactionName: 'grin',
          createdBy: 0,
        },
      ],
    };

    const newComment = {
      ...baseCommentData,
      reactionsCount: action.reactionsCount,
      ownerReactions: action.ownerReactions,
    };
    const newAllComments = {
      490: { ...newComment },
    };

    return (
      // @ts-ignorets
      expectSaga(
        onUpdateReactionOfCommentById,
        commentId,
        [
          {
            id: '0',
            reactionName: 'grin',
            createdBy: 0,
          } as IReaction,
        ],
        { 0: { smiley: 1 }, 1: { grin: 1 } },
        // @ts-ignorets
        baseCommentData,
      )
        .withState(newStore)
      // @ts-ignorets
        .put(postActions.setAllComments(newAllComments))
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(2);
        })
    );
  });
});
