import streamApi from '~/api/StreamApi';
import { IToastMessage } from '~/interfaces/common';
import { IParamPutEditArticle } from '~/interfaces/IArticle';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { IEditArticleState } from '~/screens/articles/EditArticle/store';
import useArticlesStore from '~/store/entities/articles';
import showError from '~/store/helper/showError';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';

const navigation = withNavigation(rootNavigationRef);

const putEditArticle = (set, _get) => async (params: IParamPutEditArticle) => {
  const { articleId } = params || {};
  set((state: IEditArticleState) => {
    state.loading = true;
  }, 'putEditArticle');
  try {
    const response = await streamApi.putEditArticle(params);
    useArticlesStore.getState().actions.getArticleDetail(articleId);
    set((state: IEditArticleState) => {
      state.loading = false;
    }, 'putEditArticle');

    const toastMessage: IToastMessage = {
      content: response.meta?.message || 'Success',
    };
    navigation.goBack();
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  } catch (error) {
    set((state: IEditArticleState) => {
      state.loading = false;
    }, 'putEditArticle');
    showError(error);
  }
};

export default putEditArticle;
