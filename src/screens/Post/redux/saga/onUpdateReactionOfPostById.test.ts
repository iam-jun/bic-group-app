import {expectSaga} from 'redux-saga-test-plan';

import {POST_DETAIL_3} from '~/test/mock_data/post';
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
      type: 'test',
      payload: {
        postId,
        reactionsCount: {0: {smiley: 1}, 1: {grin: 1}},
        ownerReactions: [
          {
            id: 0,
            reactionName: 'grin',
            createdBy: 0,
          },
        ],
      },
    };
    const newPost = {
      ...POST_DETAIL_3,
      reactionsCount: action.payload.reactionsCount,
      ownerReactions: action.payload.ownerReactions,
    };

    return (
      // @ts-ignorets
      expectSaga(onUpdateReactionOfPostById, action)
        .withState(storeData)
        .put(
          postActions.addToAllPosts({
            data: newPost,
          }),
        )
        .run()
        .then(({allEffects}: any) => {
          expect(allEffects?.length).toEqual(4);
        })
    );
  });

  //   it('should get comments successfully without parentId in the payload', () => {
  //     const callbackLoading = jest.fn();
  //     const action = {
  //       type: 'test',
  //       payload: {postId, isMerge: true, callbackLoading},
  //     };
  //     const response = {list: LIST_CHILD_COMMENT};

  //     return (
  //       // @ts-ignorets
  //       expectSaga(getCommentsByPostId, action)
  //         .provide([
  //           [matchers.call.fn(postDataHelper.getCommentsByPostId), response],
  //         ])
  //         .put(postActions.addToAllComments(response.list))
  //         .put(
  //           postActions.updateAllCommentsByParentIdsWithComments({
  //             id: postId,
  //             //@ts-ignore
  //             comments: response.list,
  //             isMerge: true,
  //           }),
  //         )
  //         .run()
  //         .then(({allEffects}: any) => {
  //           expect(allEffects?.length).toEqual(3);
  //         })
  //     );
  //   });

  //   it('should get comments successfully with full params in the payload', () => {
  //     const callbackLoading = jest.fn();
  //     const action = {
  //       type: 'test',
  //       payload: {postId, parentId, isMerge: true, callbackLoading},
  //     };
  //     const response = {list: LIST_CHILD_COMMENT};

  //     return (
  //       // @ts-ignorets
  //       expectSaga(getCommentsByPostId, action)
  //         .provide([
  //           [matchers.call.fn(postDataHelper.getCommentsByPostId), response],
  //         ])
  //         .withState(storeData)
  //         .put(
  //           postActions.updateAllCommentsByParentIdsWithComments({
  //             id: postId,
  //             comments: new Array(allCommentsByParentIds[302][0]) as any,
  //             isMerge: true,
  //           }),
  //         )
  //         .put(postActions.addToAllComments(response.list))
  //         .run()
  //         .then(({allEffects}: any) => {
  //           expect(allEffects?.length).toEqual(4);
  //         })
  //     );
  //   });

  //   it('should call server and server throws an error', () => {
  //     const action = {
  //       type: 'test',
  //       payload: {postId, parentId, isMerge: true},
  //     };
  //     const resp = {
  //       code: 'server_internal_error',
  //       data: null,
  //       meta: {
  //         message: 'Not a valid JWT token',
  //       },
  //     };

  //     //@ts-ignore
  //     return expectSaga(getCommentsByPostId, action)
  //       .provide([
  //         [
  //           matchers.call.fn(postDataHelper.getCommentsByPostId),
  //           Promise.reject(resp),
  //         ],
  //       ])
  //       .put(
  //         modalActions.showHideToastMessage({
  //           content: resp.meta.message,
  //           props: {
  //             textProps: {useI18n: true},
  //             type: 'error',
  //           },
  //         }),
  //       )
  //       .run()
  //       .then(({allEffects}: any) => {
  //         expect(allEffects?.length).toEqual(2);
  //       });
  //   });

  //   it('should get comments successfully with list comment is empty', () => {
  //     const action = {
  //       type: 'test',
  //       payload: {postId, parentId, isMerge: true},
  //     };
  //     const response = {list: []};

  //     return (
  //       // @ts-ignorets
  //       expectSaga(getCommentsByPostId, action)
  //         .provide([
  //           [matchers.call.fn(postDataHelper.getCommentsByPostId), response],
  //         ])
  //         .run()
  //         .then(({allEffects}: any) => {
  //           expect(allEffects?.length).toEqual(1);
  //         })
  //     );
  //   });
});
