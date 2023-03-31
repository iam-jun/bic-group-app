import useReportContentStore from '~/components/Report/store';
import APIErrorCode from '~/constants/apiErrorCode';
import {
  IParamGetPostDetail,
  IPayloadAddToAllPost,
  IPayloadGetPostDetail,
} from '~/interfaces/IPost';
import { IParamGetReportContent, TargetType } from '~/interfaces/IReport';
import { mockReportReason } from '~/test/mock_data/report';
import { IPostsState } from '..';
import Store from '~/storeRedux';
import postActions from '~/storeRedux/post/actions';
import streamApi from '~/api/StreamApi';
import showToast from '~/store/helper/showToast';
import showToastError from '~/store/helper/showToastError';

const getPostDetail = (_set, get) => async (payload: IPayloadGetPostDetail) => {
  const {
    callbackLoading, postId, isReported, ...restParams
  } = payload || {};
  const { actions }: IPostsState = get();

  if (!postId) {
    return;
  }

  try {
    callbackLoading?.(true, false);
    actions.setIsLoadingGetPostDetail(true);
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
      const responeReportContent = await streamApi.getReportContent(
        paramGetReportContent,
      );
      if (responeReportContent?.data) {
        response = responeReportContent.data.list;
        useReportContentStore
          .getState()
          .actions.addToReportDetailsPost(response);
      }
    } else {
      const responePostDetail = await streamApi.getPostDetail(params);
      if (responePostDetail?.data) {
        response = responePostDetail.data;
      }
    }

    actions.addToPosts({
      data: response || {},
      handleComment: true,
    } as IPayloadAddToAllPost);
    callbackLoading?.(false, true);
    actions.setIsLoadingGetPostDetail(false);
  } catch (e: any) {
    actions.setIsLoadingGetPostDetail(false);
    callbackLoading?.(false, false);

    if (
      e?.code === APIErrorCode.Post.POST_DELETED
      || e?.code === APIErrorCode.Post.POST_PRIVACY
    ) {
      actions.deletePostLocal(postId);
      Store.store.dispatch(postActions.setCommentErrorCode(e.code));
      if (payload?.showToast) {
        showToast({
          content: 'post:error_post_detail_deleted',
        });
      }
    } else {
      showToastError(e);
    }
  }
};

export default getPostDetail;
