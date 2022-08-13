/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import * as modalActions from '../../modal/actions';
import {
  LIST_CHILD_COMMENT,
  allCommentsByParentIds,
  allPosts,
} from '../../../test/mock_data/post';
import postDataHelper from '../../../api/PostDataHelper';
import postActions from '../actions';
import getCommentsByPostId from './getCommentsByPostId';

describe('Get comments by postId saga', () => {
  const postId = '302';
  const parentId = '490';
  const storeData = {
    post: {
      allCommentsByParentIds,
      allPosts,
    },
  };

  it('should get comments successfully with required params in the payload', () => {
    const action = {
      type: 'test',
      payload: { postId, parentId, isMerge: true },
    };
    const response = {
      list: LIST_CHILD_COMMENT,
      meta: { hasPreviousPage: true, hasNextPage: false },
    };

    return (
      // @ts-ignorets
      expectSaga(getCommentsByPostId, action)
        .provide([
          [matchers.call.fn(postDataHelper.getCommentsByPostId), response],
        ])
        .withState(storeData)
        .put(
          postActions.updateAllCommentsByParentIdsWithComments({
            id: postId,
            comments: new Array(allCommentsByParentIds[302][0]) as any,
            isMerge: true,
          }),
        )
        // @ts-ignore
        .put(postActions.addToAllComments(response.list))
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(4);
        })
    );
  });

  it('should get comments successfully without parentId in the payload', () => {
    const callbackLoading = jest.fn();
    const action = {
      type: 'test',
      payload: { postId, isMerge: true, callbackLoading },
    };
    const response = {
      list: LIST_CHILD_COMMENT,
      meta: { hasPreviousPage: true, hasNextPage: false },
    };
    const newAllPosts = storeData.post.allPosts;
    const post = newAllPosts[postId] || {};
    // @ts-ignore
    post.comments.meta.hasNextPage = response.meta.hasNextPage;
    // @ts-ignore
    newAllPosts[postId] = { ...post };
    return (
      // @ts-ignorets
      expectSaga(getCommentsByPostId, action)
        .provide([
          [matchers.call.fn(postDataHelper.getCommentsByPostId), response],
        ])
        .withState(storeData)
      // @ts-ignore
        .put(postActions.addToAllComments(response.list))
        .put(
          postActions.updateAllCommentsByParentIdsWithComments({
            id: postId,
            comments: response.list as any,
            isMerge: true,
          }),
        )
      // @ts-ignore
        .put(postActions.setAllPosts(newAllPosts))
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(5);
        })
    );
  });

  it('should get comments successfully with full params in the payload', () => {
    const callbackLoading = jest.fn();
    const action = {
      type: 'test',
      payload: {
        postId, parentId, isMerge: true, callbackLoading,
      },
    };
    const response = {
      list: LIST_CHILD_COMMENT,
      meta: { hasPreviousPage: true, hasNextPage: false },
    };

    return (
      // @ts-ignorets
      expectSaga(getCommentsByPostId, action)
        .provide([
          [matchers.call.fn(postDataHelper.getCommentsByPostId), response],
        ])
        .withState(storeData)
        .put(
          postActions.updateAllCommentsByParentIdsWithComments({
            id: postId,
            comments: new Array(allCommentsByParentIds[302][0]) as any,
            isMerge: true,
          }),
        )
      // @ts-ignore
        .put(postActions.addToAllComments(response.list))
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(4);
        })
    );
  });

  it('should call server and server throws an error', () => {
    const action = {
      type: 'test',
      payload: { postId, parentId, isMerge: true },
    };
    const resp = {
      code: 'server_internal_error',
      data: null,
      meta: {
        message: 'Not a valid JWT token',
      },
    };

    // @ts-ignore
    return expectSaga(getCommentsByPostId, action)
      .provide([
        [
          matchers.call.fn(postDataHelper.getCommentsByPostId),
          Promise.reject(resp),
        ],
      ])
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
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('should get comments successfully with list comment is empty', () => {
    const action = {
      type: 'test',
      payload: { postId, parentId, isMerge: true },
    };
    const response = { list: [] };

    return (
      // @ts-ignorets
      expectSaga(getCommentsByPostId, action)
        .provide([
          [matchers.call.fn(postDataHelper.getCommentsByPostId), response],
        ])
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(1);
        })
    );
  });
});
