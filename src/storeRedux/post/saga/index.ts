/* eslint-disable no-console */
import {
  call, put, select, takeEvery, takeLatest,
} from 'redux-saga/effects';

import API_ERROR_CODE from '~/constants/apiErrorCode';
import {
  IParamGetPostAudiences,
  IParamGetPostDetail, IPayloadAddToAllPost,
  IPayloadGetDraftPosts,
  IPayloadGetPostDetail,
  IPayloadPublishDraftPost,
  IPayloadPutEditDraftPost,
  IPostActivity,
} from '~/interfaces/IPost';
import { rootNavigationRef } from '~/router/refs';
import { withNavigation } from '~/router/helper';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import useHomeStore from '~/screens/Home/store';
import usePostsStore from '~/store/entities/posts';
import streamApi from '~/api/StreamApi';
import postActions from '~/storeRedux/post/actions';
import putEditPost from '~/storeRedux/post/saga/putEditPost';
import putMarkAsRead from '~/storeRedux/post/saga/putMarkAsRead';
import postTypes from '~/storeRedux/post/types';
import showError from '~/storeRedux/commonSaga/showError';
import * as modalActions from '~/storeRedux/modal/actions';
import { timeOut } from '~/utils/common';
import getPostsContainingVideoInProgress from './getPostsContainingVideoInProgress';
import putMarkSeenPost from './putMarKSeenPost';
import updatePostsContainingVideoInProgress from './updatePostsContainingVideoInProgress';
import deletePost from './deletePost';
import removeAudiencesFromPost from './removeAudiencesFromPost';
import useDraftPostStore from '../../../screens/post/DraftPost/store';
import useTimelineStore from '~/store/timeline';

const navigation = withNavigation(rootNavigationRef);

export default function* postSaga() {
  yield takeLatest(
    postTypes.PUT_EDIT_POST, putEditPost,
  );
  yield takeEvery(
    postTypes.DELETE_POST, deletePost,
  );
  yield takeLatest(
    postTypes.GET_POST_DETAIL, getPostDetail,
  );
  yield takeEvery(
    postTypes.POST_PUBLISH_DRAFT_POST, postPublishDraftPost,
  );
  yield takeLatest(
    postTypes.PUT_EDIT_DRAFT_POST, putEditDraftPost,
  );
  yield takeLatest(
    postTypes.PUT_MARK_AS_READ, putMarkAsRead,
  );
  yield takeLatest(
    postTypes.PUT_MARK_SEEN_POST, putMarkSeenPost,
  );
  yield takeEvery(
    postTypes.GET_CREATE_POST_INIT_AUDIENCES,
    getCreatePostInitAudiences,
  );
  yield takeLatest(
    postTypes.DELETE_POST_LOCAL, deletePostLocal,
  );
  yield takeLatest(
    postTypes.GET_POSTS_CONTAINING_VIDEO_IN_PROGRESS,
    getPostsContainingVideoInProgress,
  );
  yield takeLatest(
    postTypes.UPDATE_POSTS_CONTAINING_VIDEO_IN_PROGRESS,
    updatePostsContainingVideoInProgress,
  );
  yield takeLatest(
    postTypes.REMOVE_POST_AUDIENCES,
    removeAudiencesFromPost,
  );
}

function* postPublishDraftPost({
  payload,
}: {
  type: string;
  payload: IPayloadPublishDraftPost;
}): any {
  const {
    draftPostId,
    onSuccess,
    onError,
    replaceWithDetail,
    createFromGroupId,
  } = payload || {};
  try {
    yield put(postActions.setLoadingCreatePost(true));
    const res = yield call(
      streamApi.postPublishDraftPost, draftPostId,
    );
    yield put(postActions.setLoadingCreatePost(false));

    if (!res.data) {
      onError?.();
      yield showError(res);
      return;
    }

    onSuccess?.();
    const postData: IPostActivity = res.data;
    usePostsStore.getState().actions.addToPosts({ data: postData } as IPayloadAddToAllPost);
    if (res.data?.isProcessing) {
      yield put(modalActions.showHideToastMessage({
        content: 'post:draft:text_processing_publish',
      }));
      navigation.goBack();
      yield put(postActions.getAllPostContainingVideoInProgress());
    } else if (replaceWithDetail) {
      navigation.replace(
        homeStack.postDetail, { post_id: postData?.id },
      );
    }
    if (createFromGroupId) {
      useTimelineStore.getState().actions.getPosts(createFromGroupId);
    }
    const payloadGetDraftPosts: IPayloadGetDraftPosts = {
      isRefresh: true,
    };
    useHomeStore.getState().actions.refreshHome();
    yield call(useDraftPostStore.getState().doGetDraftPosts, payloadGetDraftPosts);
  } catch (e) {
    yield put(postActions.setLoadingCreatePost(false));
    onError?.();
    yield showError(e);
  }
}

function* putEditDraftPost({
  payload,
}: {
  type: string;
  payload: IPayloadPutEditDraftPost;
}): any {
  const {
    id, data, replaceWithDetail, publishNow, createFromGroupId,
  } = payload || {};
  if (!id || !data) {
    console.log('\x1b[31m🐣️ saga putEditDraftPost error\x1b[0m');
    return;
  }

  try {
    yield put(postActions.setLoadingCreatePost(true));
    const isSavingDraftPost = yield select((state) => state?.post?.createPost?.isSavingDraftPost);
    if (isSavingDraftPost) {
      yield timeOut(300);
      yield put(postActions.putEditDraftPost(payload));
      return;
    }
    const response = yield streamApi.putEditPost({ postId: id, data });
    if (response?.data) {
      if (publishNow) {
        const p: IPayloadPublishDraftPost = {
          draftPostId: id,
          replaceWithDetail,
          refreshDraftPosts: true,
          createFromGroupId,
        };
        yield put(postActions.postPublishDraftPost(p));
      } else {
        yield put(postActions.setLoadingCreatePost(false));
        const payloadGetDraftPosts: IPayloadGetDraftPosts = {
          isRefresh: true,
        };
        yield call(useDraftPostStore.getState().doGetDraftPosts, payloadGetDraftPosts);
        navigation.goBack();
        yield put(modalActions.showHideToastMessage({
          content: 'post:draft:text_draft_saved',
        }));
      }
    } else {
      yield put(postActions.setLoadingCreatePost(false));
      yield showError(response);
    }
  } catch (e) {
    yield put(postActions.setLoadingCreatePost(false));
    yield showError(e);
  }
}

function* getPostDetail({
  payload,
}: {
  type: string;
  payload: IPayloadGetPostDetail;
}): any {
  const { callbackLoading, postId, ...restParams } = payload || {};
  if (!postId) {
    return;
  }
  try {
    callbackLoading?.(
      true, false,
    );
    yield put(postActions.setLoadingGetPostDetail(true));
    const params: IParamGetPostDetail = {
      postId,
      // is_draft
      ...restParams,
    };
    const response = yield call(
      streamApi.getPostDetail, params,
    );
    yield timeOut(500);
    usePostsStore.getState().actions.addToPosts(
      { data: response?.data || {}, handleComment: true } as IPayloadAddToAllPost,
    );
    callbackLoading?.(false, true);
    yield put(postActions.setLoadingGetPostDetail(false));
  } catch (e: any) {
    yield timeOut(500);
    yield put(postActions.setLoadingGetPostDetail(false));
    callbackLoading?.(
      false, false,
    );
    if (
      e?.code === API_ERROR_CODE.POST.postDeleted
      || e?.code === API_ERROR_CODE.POST.postPrivacy
    ) {
      yield put(postActions.deletePostLocal(postId));
      yield put(postActions.setCommentErrorCode(e.code));
      if (payload?.showToast) {
        yield put(modalActions.showHideToastMessage({
          content: 'post:error_post_detail_deleted',
        }));
      }
    } else {
      yield showError(e);
    }
  }
}

function* getCreatePostInitAudiences({
  payload,
}: {
  type: string;
  payload: IParamGetPostAudiences;
}): any {
  try {
    const response = yield streamApi.getPostAudience(payload);
    if (response?.data) {
      yield put(postActions.setCreatePostInitAudiences(response.data));
    }
  } catch (e: any) {
    console.log(
      '\x1b[31m🐣️ saga getCreatePostInitAudiences e:', e, '\x1b[0m',
    );
  }
}

function* deletePostLocal({ payload }: {type: string; payload: string}): any {
  if (!payload) {
    console.log('\x1b[31m🐣️ saga deletePost: id not found\x1b[0m');
    return;
  }
  try {
    const post = usePostsStore.getState()?.posts?.[payload] || {};
    if (post) {
      post.deleted = true;
      usePostsStore.getState().actions.addToPosts({ data: post } as IPayloadAddToAllPost);
    }
  } catch (e) {
    yield showError(e);
  }
}
