import i18next from 'i18next';
import uuid from 'react-native-uuid';
import streamApi from '~/api/StreamApi';
import { IToastMessage } from '~/interfaces/common';
import { IEditAritcleError, IPayloadPublishDraftArticle, IPayloadPutEditArticle } from '~/interfaces/IArticle';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { IEditArticleState } from '~/screens/articles/EditArticle/store';
import useArticlesStore from '~/screens/articles/ArticleDetail/store';
import showError from '~/store/helper/showError';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import useDraftArticleStore from '~/screens/Draft/DraftArticle/store';
import { EditArticleErrorType } from '~/constants/article';

const navigation = withNavigation(rootNavigationRef);

const putEditArticle = (set, get) => async (
  params: IPayloadPutEditArticle,
  callbackError?: (data: IEditAritcleError) => void,
) => {
  const { articleId, data } = params || {};
  set((state: IEditArticleState) => {
    state.loading = true;
  }, 'putEditArticle');
  try {
    const categories = data?.categories?.map?.((category) => category?.id);
    const series = data?.series?.map?.((item) => item?.id);

    const params = { ...data, categories, series } as any;
    delete params.id;

    const response = await streamApi.putEditArticle(articleId, params);

    if (!response?.data) {
      showError(response);
      set((state: IEditArticleState) => {
        state.loading = false;
      }, 'putEditArticleError');
      return;
    }

    useArticlesStore.getState().actions.getArticleDetail(articleId);

    set((state: IEditArticleState) => {
      state.loading = false;
    }, 'putEditArticleSuccess');

    if (get().isPublishing) {
      const goToArticleDetail = () => {
        navigation.replaceListScreenByNewScreen([
          articleStack.editArticleTitle,
          articleStack.editArticleSummary,
          articleStack.editArticleCover,
          articleStack.editArticleCategory,
          articleStack.editArticleAudience,
          articleStack.editArticleSeries,
          articleStack.editArticleContent,
        ], {
          key: `${articleStack.articleDetail}-${uuid.v4()}`,
          name: articleStack.articleDetail,
          params: { articleId },
        });
      };

      const payload: IPayloadPublishDraftArticle = {
        draftArticleId: articleId,
        onSuccess: () => {
          Store.store.dispatch(modalActions.showHideToastMessage({ content: 'post:draft:text_draft_article_published' }));
          goToArticleDetail();
        },
        onError: () => {
          // do something
        },
      };
      useDraftArticleStore.getState().actions.publishDraftArticle(payload);
    } else {
      const toastMessage: IToastMessage = {
        content: response?.meta?.message || i18next.t('article:text_edit_article_success'),
      };
      Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
      navigation.goBack();
    }
  } catch (error) {
    set((state: IEditArticleState) => {
      state.loading = false;
    }, 'putEditArticleError');
    if (error?.meta?.errors?.series_denied) {
      callbackError?.({
        type: EditArticleErrorType.SERIES_DENIED,
        ids: error.meta.errors.series_denied,
      });
    } else if (error?.meta?.errors?.groups_denied) {
      callbackError?.({
        type: EditArticleErrorType.SERIES_DENIED,
        ids: error.meta.errors.groups_denied,
      });
    } else {
      showError(error);
    }
  }
};

export default putEditArticle;
