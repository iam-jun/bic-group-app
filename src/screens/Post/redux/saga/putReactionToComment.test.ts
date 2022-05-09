import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import {baseCommentData} from '~/test/mock_data/post';
import postDataHelper from '../../helper/PostDataHelper';
import postActions from '../actions';
import putReactionToComment from './putReactionToComment';

describe('Update Reaction Of Comment By Id saga', () => {
  const commentId = baseCommentData.id;
  const storeData = {
    post: {
      allComments: {
        490: {...baseCommentData},
      },
    },
  };

  it('should put reaction to comment successfully with required params in the payload', () => {
    const action = {
      type: 'test',
      payload: {
        id: baseCommentData.id,
        comment: {},
        postId: baseCommentData.id,
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
        reactionName: 'grinning',
        createdAt: '2022-05-09T11:05:00.023Z',
      },
      meta: {
        message: 'OK',
      },
    };

    const newComment = {
      ...baseCommentData,
      reactionsCount: {'1': {smiley: 1}},
      ownerReactions: [{reactionName: 'smiley', loading: true}],
    };
    const newAllComments = {
      490: {...newComment},
    };

    return (
      // @ts-ignorets
      expectSaga(putReactionToComment, action)
        .withState(storeData)
        .withState(storeData)
        .put(postActions.setAllComments(newAllComments))
        .provide([[matchers.call.fn(postDataHelper.putReaction), response]])
        .run()
        .then(({allEffects}: any) => {
          expect(allEffects?.length).toEqual(4);
        })
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
        .then(({allEffects}: any) => {
          expect(allEffects?.length).toEqual(0);
        })
    );
  });

  it('should do nothing when user reaction this icon', () => {
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
        .then(({allEffects}: any) => {
          expect(allEffects?.length).toEqual(0);
        })
    );
  });
});
