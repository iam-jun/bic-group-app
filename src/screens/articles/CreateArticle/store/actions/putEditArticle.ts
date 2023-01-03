import i18next from 'i18next';
import streamApi from '~/api/StreamApi';
import { IToastMessage } from '~/interfaces/common';
import { IEditAritcleError, IPayloadPutEditArticle } from '~/interfaces/IArticle';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { ICreateArticleState } from '~/screens/articles/CreateArticle/store';
import useArticlesStore from '~/screens/articles/ArticleDetail/store';
import showError from '~/store/helper/showError';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';
import { EditArticleErrorType } from '~/constants/article';

const navigation = withNavigation(rootNavigationRef);

const putEditArticle = (set, _get) => async (
  params: IPayloadPutEditArticle,
  callbackError?: (data: IEditAritcleError) => void,
) => {
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
    if (error?.meta?.errors?.series_denied) {
      callbackError?.({
        type: EditArticleErrorType.SERIES_DENIED,
        ids: error.meta.errors.series_denied,
        error,
      });
    } else if (error?.meta?.errors?.groups_denied) {
      callbackError?.({
        type: EditArticleErrorType.GROUPS_DENIED,
        ids: error.meta.errors.groups_denied,
        error,
      });
    } else {
      showError(error);
    }
  }
};

export default putEditArticle;
