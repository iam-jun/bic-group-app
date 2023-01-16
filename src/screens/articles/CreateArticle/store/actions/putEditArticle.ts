import streamApi from '~/api/StreamApi';
import { IPayloadPutEditArticle } from '~/interfaces/IArticle';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { ICreateArticleState } from '~/screens/articles/CreateArticle/store';
import useArticlesStore from '~/screens/articles/ArticleDetail/store';
import useScheduleArticlesStore from '~/screens/YourContent/components/ScheduledArticles/store';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';

const navigation = withNavigation(rootNavigationRef);

const putEditArticle = (set, get) => async (params: IPayloadPutEditArticle) => {
  const state: ICreateArticleState = get();
  const createArticleActions = state?.actions;

  const {
    articleId, data, isNavigateBack = true, isShowToast = true, isShowLoading = true, onSuccess,
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
      showToastError(response);
      set((state: ICreateArticleState) => {
        state.loading = false;
      }, 'putEditArticleError');
      return;
    }

    useArticlesStore.getState().actions.getArticleDetail(articleId);
    onSuccess?.();

    set((state: ICreateArticleState) => {
      state.loading = false;
    }, 'putEditArticleSuccess');

    if (isShowToast) {
      showToastSuccess(response, 'article:text_edit_article_success');
    }
    onSuccess?.();
    useScheduleArticlesStore.getState().actions.getScheduleArticles({ isRefresh: true });
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
