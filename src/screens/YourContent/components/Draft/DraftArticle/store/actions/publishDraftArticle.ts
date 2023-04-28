import streamApi from '~/api/StreamApi';
import { IPayloadPublishDraftArticle } from '~/interfaces/IArticle';
import {
  IPayloadAddToAllPost, IPayloadGetDraftContents, IPost, PostStatus,
} from '~/interfaces/IPost';
import showToastError from '~/store/helper/showToastError';
import { rootNavigationRef } from '~/router/refs';
import { withNavigation } from '~/router/helper';
import usePostsStore from '~/store/entities/posts';
import useHomeStore from '~/screens/Home/store';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import usePostsInProgressStore from '~/screens/Home/components/VideoProcessingNotice/store';
import { IDraftArticleState } from '..';
import useDraftContentsStore from '../../../DraftContents/store';
import showToastSuccess from '~/store/helper/showToastSuccess';

const navigation = withNavigation(rootNavigationRef);

const publishDraftArticle = (set, get) => async (payload: IPayloadPublishDraftArticle) => {
  const {
    draftArticleId,
    replaceWithDetail,
    onSuccess,
    onError,
  } = payload;
  const { actions } = get();
  try {
    set((state: IDraftArticleState) => {
      state.isPublishing = true;
    }, 'publishDraftArticle');

    const response = await streamApi.publishDraftArticle(draftArticleId);

    if (!response.data) {
      set((state: IDraftArticleState) => {
        state.isPublishing = false;
      }, 'publishDraftArticle error');
      onError ? onError(response) : showToastError(response);
      return;
    }

    onSuccess?.();
    set((state: IDraftArticleState) => {
      state.isPublishing = false;
    }, 'publishDraftArticle success');
    const contentData: IPost = response.data;
    usePostsStore.getState().actions.addToPosts({ data: contentData } as IPayloadAddToAllPost);

    if (response.data?.status === PostStatus.PROCESSING) {
      showToastSuccess(response);
      // navigation.goBack();
      usePostsInProgressStore.getState().actions.getPosts();
    } else if (replaceWithDetail) {
      navigation.replace(
        articleStack.articleDetail, { articleId: contentData?.id },
      );
    }

    const payloadGetDraftArticles: IPayloadGetDraftContents = {
      isRefresh: true,
    };
    useHomeStore.getState().actions.refreshHome();
    actions.getDraftArticles(payloadGetDraftArticles);
    useDraftContentsStore.getState().actions.getDraftContents({ isRefresh: true });
  } catch (error) {
    console.error('publishDraftArticle error:', error);
    set((state: IDraftArticleState) => {
      state.isPublishing = false;
    }, 'publishDraftArticle error');
    onError ? onError(error) : showToastError(error);
  }
};

export default publishDraftArticle;
