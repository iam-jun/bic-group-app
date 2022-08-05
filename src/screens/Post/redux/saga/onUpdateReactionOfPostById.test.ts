import { expectSaga } from 'redux-saga-test-plan';

import { POST_DETAIL_3 } from '~/test/mock_data/post';
import postActions from '../actions';
import onUpdateReactionOfPostById from './onUpdateReactionOfPostById';

describe('Update Reaction Of Post By Id saga', () => {
  const postId = POST_DETAIL_3.id;
  const storeData = {
    post: {
      allPosts: {
        302: POST_DETAIL_3,
      },
    },
  };

  it('should update reaction of post by id successfully with required params in the payload', () => {
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
    const newPost = {
      ...POST_DETAIL_3,
      reactionsCount: action.reactionsCount,
      ownerReactions: action.ownerReactions,
    };

    return (
      // @ts-ignorets
      expectSaga(
        onUpdateReactionOfPostById,
        postId,
        [
          {
            id: 0,
            reactionName: 'grin',
            createdBy: 0,
          },
        ],
        { 0: { smiley: 1 }, 1: { grin: 1 } },
      )
        .withState(storeData)
        .put(
          postActions.addToAllPosts({
            // @ts-ignore
            data: newPost,
          }),
        )
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(2);
        })
    );
  });
});
