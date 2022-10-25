import i18next from 'i18next';
import streamApi from '~/api/StreamApi';
import { IToastMessage } from '~/interfaces/common';
import { IPayloadPutEditArticle } from '~/interfaces/IArticle';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { IEditArticleState } from '~/screens/articles/EditArticle/store';
import useArticlesStore from '~/screens/articles/ArticleDetail/store';
import showError from '~/store/helper/showError';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';

const navigation = withNavigation(rootNavigationRef);

const putEditArticle = (set, _get) => async (params: IPayloadPutEditArticle) => {
  const { articleId, data } = params || {};
  set((state: IEditArticleState) => {
    state.loading = true;
  }, 'putEditArticle');
  try {
    const categories = data?.categories?.map?.((category) => category?.id);
    const params = { ...data, categories };
    const response = await streamApi.putEditArticle(articleId, params);
    useArticlesStore.getState().actions.getArticleDetail(articleId);
    set((state: IEditArticleState) => {
      state.loading = false;
    }, 'putEditArticleSuccess');

    if (!response?.data) {
      showError(response);
      return;
    }

    const toastMessage: IToastMessage = {
      content: i18next.t('article:text_edit_article_success'),
    };
    navigation.goBack();
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  } catch (error) {
    set((state: IEditArticleState) => {
      state.loading = false;
    }, 'putEditArticleError');
    showError(error);
  }
};

export default putEditArticle;
