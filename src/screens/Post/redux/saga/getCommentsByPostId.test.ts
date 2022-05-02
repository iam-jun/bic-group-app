import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import * as modalActions from '~/store/modal/actions';
import {
  LIST_CHILD_COMMENT,
  allCommentsByParentIds,
} from '~/test/mock_data/post';
import postDataHelper from '../../helper/PostDataHelper';
import postActions from '../actions';
import getCommentsByPostId from './getCommentsByPostId';

describe('Get comments by postId saga', () => {
  const postId = 302;
  const parentId = 490;
  const storeData = {
    post: {
      allCommentsByParentIds: allCommentsByParentIds,
    },
  };

  it('should get comments successfully with required params in the payload', () => {
    const action = {
      type: 'test',
      payload: {postId, parentId, isMerge: true},
    };
    const response = {list: LIST_CHILD_COMMENT};

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
        .put(postActions.addToAllComments(response.list))
        .run()
        .then(({allEffects}: any) => {
          expect(allEffects?.length).toEqual(4);
        })
    );
  });

  it('should get comments successfully without parentId in the payload', () => {
    const callbackLoading = jest.fn();
    const action = {
      type: 'test',
      payload: {postId, isMerge: true, callbackLoading},
    };
    const response = {list: LIST_CHILD_COMMENT};

    return (
      // @ts-ignorets
      expectSaga(getCommentsByPostId, action)
        .provide([
          [matchers.call.fn(postDataHelper.getCommentsByPostId), response],
        ])
        .put(postActions.addToAllComments(response.list))
        .put(
          postActions.updateAllCommentsByParentIdsWithComments({
            id: postId,
            //@ts-ignore
            comments: response.list,
            isMerge: true,
          }),
        )
        .run()
        .then(({allEffects}: any) => {
          expect(allEffects?.length).toEqual(3);
        })
    );
  });

  it('should get comments successfully with full params in the payload', () => {
    const callbackLoading = jest.fn();
    const action = {
      type: 'test',
      payload: {postId, parentId, isMerge: true, callbackLoading},
    };
    const response = {list: LIST_CHILD_COMMENT};

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
        .put(postActions.addToAllComments(response.list))
        .run()
        .then(({allEffects}: any) => {
          expect(allEffects?.length).toEqual(4);
        })
    );
  });

  it('should call server and server throws an error', () => {
    const action = {
      type: 'test',
      payload: {postId, parentId, isMerge: true},
    };
    const resp = {
      code: 'server_internal_error',
      data: null,
      meta: {
        message: 'Not a valid JWT token',
      },
    };

    //@ts-ignore
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
            textProps: {useI18n: true},
            type: 'error',
          },
        }),
      )
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });

  it('should get comments successfully with list comment is empty', () => {
    const action = {
      type: 'test',
      payload: {postId, parentId, isMerge: true},
    };
    const response = {list: []};

    return (
      // @ts-ignorets
      expectSaga(getCommentsByPostId, action)
        .provide([
          [matchers.call.fn(postDataHelper.getCommentsByPostId), response],
        ])
        .run()
        .then(({allEffects}: any) => {
          expect(allEffects?.length).toEqual(1);
        })
    );
  });
});
