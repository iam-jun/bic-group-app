/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import API_ERROR_CODE from '../../../constants/apiErrorCode';

import * as modalActions from '../../modal/actions';
import {
  POST_DETAIL_3,
  allCommentsByParentIds,
  allPosts,
  baseCommentData,
} from '../../../test/mock_data/post';
import streamApi from '../../../api/StreamApi';
import postActions from '../actions';
import getCommentDetail from './getCommentDetail';

describe('Get comments detail saga', () => {
  const commentId = 505;
  const storeData = {
    post: {
      allCommentsByParentIds,
      allPosts,
    },
  };

  it('should get comments successfully with required params in the payload', () => {
    const action = {
      type: 'test',
      payload: { commentId },
    };
    const response = {
      list: [baseCommentData],
      actor: POST_DETAIL_3.actor,
    };

    return (
      // @ts-ignorets
      expectSaga(getCommentDetail, action)
        .provide([
          [matchers.call.fn(streamApi.getCommentDetail), response],
        ])
        .put(
          postActions.updateAllCommentsByParentIdsWithComments({
            id: baseCommentData.postId,
            commentId: baseCommentData.id,
            comments: [baseCommentData] as any,
            isMerge: false,
            isReplace: true,
          }),
        )
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(4);
        })
    );
  });

  it('should get comments successfully with full params in the payload', () => {
    const callbackLoading = jest.fn();
    const action = {
      type: 'test',
      payload: { commentId, callbackLoading },
    };
    const response = {
      list: [baseCommentData],
      actor: POST_DETAIL_3.actor,
    };

    return (
      // @ts-ignorets
      expectSaga(getCommentDetail, action)
        .provide([
          [matchers.call.fn(streamApi.getCommentDetail), response],
        ])
        .put(
          postActions.updateAllCommentsByParentIdsWithComments({
            id: baseCommentData.postId,
            commentId: baseCommentData.id,
            comments: [baseCommentData] as any,
            isMerge: false,
            isReplace: true,
          }),
        )
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(4);
        })
    );
  });

  it('should call server and server throws an error', () => {
    const action = {
      type: 'test',
      payload: { commentId, isMerge: false },
    };

    const resp = {
      code: 'server_internal_error',
      data: null,
      meta: {
        message: 'Not a valid JWT token',
      },
    };

    // @ts-ignore
    return expectSaga(getCommentDetail, action)
      .provide([
        [
          matchers.call.fn(streamApi.getCommentDetail),
          Promise.reject(resp),
        ],
      ])
      .put(
        modalActions.showHideToastMessage({
          content: resp.meta.message,
          props: { type: 'error' },
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('should call server and server throws an error this post is private', () => {
    const action = {
      type: 'test',
      payload: { commentId },
    };

    const resp = {
      code: API_ERROR_CODE.POST.postPrivacy,
      data: null,
      meta: {
        message: 'Not a valid JWT token',
      },
    };

    // @ts-ignore
    return expectSaga(getCommentDetail, action)
      .provide([
        [
          matchers.call.fn(streamApi.getCommentDetail),
          Promise.reject(resp),
        ],
      ])
      .put(postActions.setCommentErrorCode(resp.code))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('should call server and server throws an error this comment is delete', () => {
    const action = {
      type: 'test',
      payload: { commentId },
    };

    const resp = {
      code: API_ERROR_CODE.POST.copiedCommentIsDeleted,
      data: null,
      meta: {
        message: 'Not a valid JWT token',
      },
    };

    // @ts-ignore
    return expectSaga(getCommentDetail, action)
      .provide([
        [
          matchers.call.fn(streamApi.getCommentDetail),
          Promise.reject(resp),
        ],
      ])
      .put(postActions.setCommentErrorCode(resp.code))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('should get comments successfully with list comment is empty', () => {
    const action = {
      type: 'test',
      payload: { commentId, isMerge: false },
    };
    const response = { list: [] };
    // @ts-ignorets
    return expectSaga(getCommentDetail, action)
      .provide([[matchers.call.fn(streamApi.getCommentDetail), response]])
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(1);
      });
  });
});
