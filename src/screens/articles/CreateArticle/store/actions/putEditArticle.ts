import i18next from 'i18next';
import streamApi from '~/api/StreamApi';
import { IToastMessage } from '~/interfaces/common';
import { IPayloadPutEditArticle } from '~/interfaces/IArticle';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { ICreateArticleState } from '~/screens/articles/CreateArticle/store';
import useArticlesStore from '~/screens/articles/ArticleDetail/store';
import showError from '~/store/helper/showError';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';

const navigation = withNavigation(rootNavigationRef);

const putEditArticle = (set, get) => async (params: IPayloadPutEditArticle) => {
  const state: ICreateArticleState = get();
  const createArticleActions = state?.actions;

  const {
    articleId, data, isNavigateBack = true, isShowToast = true, isShowLoading = true,
  } = params || {};
  if (isShowLoading) {
    set((state: ICreateArticleState) => {
      state.loading = true;
    }, 'putEditArticle');
  }

  try {
    const categories = data?.categories?.map?.((category) => category?.id);
    const series = data?.series?.map?.((item) => item?.id);
    const tags = data?.tags?.map?.((item) => item?.id);

    const params = {
      ...data, categories, series, tags,
    } as any;
    delete params.id;

    const response = await streamApi.putEditArticle(articleId, params);

    if (!response?.data) {
      showError(response);
      set((state: ICreateArticleState) => {
        state.loading = false;
      }, 'putEditArticleError');
      return;
    }

    useArticlesStore.getState().actions.getArticleDetail(articleId);

    set((state: ICreateArticleState) => {
      state.loading = false;
    }, 'putEditArticleSuccess');

    if (isShowToast) {
      const toastMessage: IToastMessage = {
        content: response?.meta?.message || i18next.t('article:text_edit_article_success'),
      };
      Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
    }
    if (isNavigateBack) {
      navigation.goBack();
    }
  } catch (error) {
    set((state: ICreateArticleState) => {
      state.loading = false;
    }, 'putEditArticleError');
    createArticleActions?.handleSaveError(error);
  }
};

export default putEditArticle;
