/* eslint-disable no-console */
import {
  call, put, takeLatest,
} from 'redux-saga/effects';

import APIErrorCode from '~/constants/apiErrorCode';
import {
  IParamGetPostDetail, IPayloadAddToAllPost,
  IPayloadGetPostDetail,
} from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import streamApi from '~/api/StreamApi';
import postActions from '~/storeRedux/post/actions';
import postTypes from '~/storeRedux/post/types';
import { timeOut } from '~/utils/common';
import removeAudiencesFromPost from './removeAudiencesFromPost';
import { mockReportReason } from '~/test/mock_data/report';
import { IParamGetReportContent, TargetType } from '~/interfaces/IReport';
import showToast from '~/store/helper/showToast';
import showToastError from '~/store/helper/showToastError';
import useReportContentStore from '~/components/Report/store';

export default function* postSaga() {
  yield takeLatest(
    postTypes.GET_POST_DETAIL, getPostDetail,
  );
  yield takeLatest(
    postTypes.REMOVE_POST_AUDIENCES,
    removeAudiencesFromPost,
  );
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
