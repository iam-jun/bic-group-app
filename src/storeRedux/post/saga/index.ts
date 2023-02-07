/* eslint-disable no-console */
import {
  call, put, select, takeEvery, takeLatest,
} from 'redux-saga/effects';

import APIErrorCode from '~/constants/apiErrorCode';
import {
  IParamGetPostAudiences,
  IParamGetPostDetail, IPayloadAddToAllPost,
  IPayloadGetDraftPosts,
  IPayloadGetPostDetail,
  IPayloadPublishDraftPost,
  IPayloadPutEditDraftPost,
  IPost,
  PostStatus,
} from '~/interfaces/IPost';
import { rootNavigationRef } from '~/router/refs';
import { withNavigation } from '~/router/helper';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import useHomeStore from '~/screens/Home/store';
import usePostsStore from '~/store/entities/posts';
import streamApi from '~/api/StreamApi';
import postActions from '~/storeRedux/post/actions';
import postTypes from '~/storeRedux/post/types';
import { timeOut } from '~/utils/common';
import removeAudiencesFromPost from './removeAudiencesFromPost';
import useDraftPostStore from '../../../screens/Draft/DraftPost/store';
import useTimelineStore from '~/store/timeline';
import { mockReportReason } from '~/test/mock_data/report';
import { IParamGetReportContent, TargetType } from '~/interfaces/IReport';
import usePostsInProgressStore from '~/screens/Home/components/VideoProcessingNotice/store';
import showToast from '~/store/helper/showToast';
import showToastError from '~/store/helper/showToastError';
import useReportContentStore from '~/components/Report/store';
import useCreatePostStore from '~/screens/post/CreatePost/store';

const navigation = withNavigation(rootNavigationRef);

export default function* postSaga() {
  yield takeLatest(
    postTypes.GET_POST_DETAIL, getPostDetail,
  );
  yield takeEvery(
    postTypes.POST_PUBLISH_DRAFT_POST, postPublishDraftPost,
  );
  yield takeLatest(
    postTypes.PUT_EDIT_DRAFT_POST, putEditDraftPost,
  );
  yield takeEvery(
    postTypes.GET_CREATE_POST_INIT_AUDIENCES,
    getCreatePostInitAudiences,
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
    useCreatePostStore.getState().actions.setLoadingCreatePost(true);
    const res = yield call(
      streamApi.postPublishDraftPost, draftPostId,
    );
    useCreatePostStore.getState().actions.setLoadingCreatePost(false);

    if (!res.data) {
      onError?.();
      showToastError(res);
      return;
    }

    onSuccess?.();
    const postData: IPost = res.data;
    usePostsStore.getState().actions.addToPosts({ data: postData } as IPayloadAddToAllPost);
    if (res.data?.status === PostStatus.PROCESSING) {
      showToast({
        content: 'post:draft:text_processing_publish',
      });
      navigation.goBack();
      usePostsInProgressStore.getState().actions.getPosts();
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
    yield call(useDraftPostStore.getState().actions.getDraftPosts, payloadGetDraftPosts);
  } catch (e) {
    useCreatePostStore.getState().actions.setLoadingCreatePost(false);
    onError?.();
    showToastError(e);
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
    useCreatePostStore.getState().actions.setLoadingCreatePost(true);
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
        useCreatePostStore.getState().actions.setLoadingCreatePost(false);
        const payloadGetDraftPosts: IPayloadGetDraftPosts = {
          isRefresh: true,
        };
        yield call(useDraftPostStore.getState().actions.getDraftPosts, payloadGetDraftPosts);
        navigation.goBack();
        showToast({
          content: 'post:draft:text_draft_saved',
        });
      }
    } else {
      useCreatePostStore.getState().actions.setLoadingCreatePost(false);
      showToastError(response);
    }
  } catch (e) {
    useCreatePostStore.getState().actions.setLoadingCreatePost(false);
    showToastError(e);
  }
}

function* getPostDetail({
  payload,
}: {
  type: string;
  payload: IPayloadGetPostDetail;
}): any {
  const {
    callbackLoading, postId, isReported, ...restParams
  } = payload || {};
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

    let response = null;

    if (isReported) {
      const paramGetReportContent: IParamGetReportContent = {
        order: 'ASC',
        offset: 0,
        limit: mockReportReason.length,
        targetIds: [postId],
        targetType: TargetType.POST,
      };
      const responeReportContent = yield call(streamApi.getReportContent, paramGetReportContent);
      if (responeReportContent?.data) {
        response = responeReportContent.data.list;
        useReportContentStore.getState().actions.addToReportDetailsPost(response);
      }
    } else {
      const responePostDetail = yield call(streamApi.getPostDetail, params);
      if (responePostDetail?.data) {
        response = responePostDetail.data;
      }
    }

    yield timeOut(500);
    usePostsStore.getState().actions.addToPosts(
      { data: response || {}, handleComment: true } as IPayloadAddToAllPost,
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
      e?.code === APIErrorCode.Post.POST_DELETED
      || e?.code === APIErrorCode.Post.POST_PRIVACY
    ) {
      usePostsStore.getState().actions.deletePostLocal(postId);
      yield put(postActions.setCommentErrorCode(e.code));
      if (payload?.showToast) {
        showToast({
          content: 'post:error_post_detail_deleted',
        });
      }
    } else {
      showToastError(e);
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
