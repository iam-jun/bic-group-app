import Store from '~/storeRedux';
import streamApi from '~/api/StreamApi';
import { IPayloadPublishDraftArticle } from '~/interfaces/IArticle';
import { IPayloadAddToAllPost, IPayloadGetDraftPosts, IPost } from '~/interfaces/IPost';
import showError from '~/store/helper/showError';
import { rootNavigationRef } from '~/router/refs';
import { withNavigation } from '~/router/helper';
import usePostsStore from '~/store/entities/posts';
import modalActions from '~/storeRedux/modal/actions';
import postActions from '~/storeRedux/post/actions';
import useHomeStore from '~/screens/Home/store';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import { IDraftArticleState } from '..';

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
      onError ? onError(response) : showError(response);
      return;
    }

    onSuccess?.();
    set((state: IDraftArticleState) => {
      state.isPublishing = false;
    }, 'publishDraftArticle success');
    const contentData: IPost = response.data;
    usePostsStore.getState().actions.addToPosts({ data: contentData } as IPayloadAddToAllPost);

    if (response.data?.isProcessing) {
      Store.store.dispatch(modalActions.showHideToastMessage({
        content: 'post:draft:text_processing_publish',
      }));
      // navigation.goBack();
      Store.store.dispatch(postActions.getAllPostContainingVideoInProgress());
    } else if (replaceWithDetail) {
      navigation.replace(
        articleStack.articleDetail, { articleId: contentData?.id },
      );
    }

    const payloadGetDraftArticles: IPayloadGetDraftPosts = {
      isRefresh: true,
    };
    useHomeStore.getState().actions.refreshHome();
    actions.getDraftArticles(payloadGetDraftArticles);
  } catch (error) {
    console.error('publishDraftArticle error:', error);
    set((state: IDraftArticleState) => {
      state.isPublishing = false;
    }, 'publishDraftArticle error');
    onError ? onError(error) : showError(error);
  }
};

export default publishDraftArticle;
