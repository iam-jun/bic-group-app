import streamApi from '~/api/StreamApi';
import { IPayloadPutEditArticle } from '~/interfaces/IArticle';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { ICreateArticleState } from '~/screens/articles/CreateArticle/store';
import useArticlesStore from '~/screens/articles/ArticleDetail/store';
import useScheduleArticlesStore from '~/screens/YourContent/components/ScheduledArticles/store';
// import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';
import useValidateSeriesTags from '~/components/ValidateSeriesTags/store';
import { PostType } from '~/interfaces/IPost';

const navigation = withNavigation(rootNavigationRef);

const putEditArticle = (set, get) => async (params: IPayloadPutEditArticle) => {
  const {
    articleId, data, isNavigateBack = true, isShowToast = true, isShowLoading = true, onSuccess,
  } = params || {};
  if (isShowLoading) {
    set((state: ICreateArticleState) => {
      state.loading = true;
    }, 'putEditArticle');
  }

  try {
    const { isDraft } = get();
    const categories = data?.categories?.map?.((category) => category?.id);
    const series = data?.series?.map?.((item) => item?.id);
    const tags = data?.tags?.map?.((item) => item?.id);
    const coverMedia = data?.coverMedia?.id && { id: data?.coverMedia?.id };

    const params = {
      ...data, categories, series, tags, coverMedia,
    } as any;
    delete params.id;
    
    let response = null;
    if (isDraft) {
      response = await streamApi.putAutoSaveArticle(articleId, params);
    } else {
      response = await streamApi.putEditArticle(articleId, params);
    }

    useArticlesStore.getState().actions.getArticleDetail({ articleId });

    set((state: ICreateArticleState) => {
      state.loading = false;
    }, 'putEditArticleSuccess');

    if (!isDraft && isShowToast) {
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
    useValidateSeriesTags.getState().actions.handleSeriesTagsError({ error, postType: PostType.ARTICLE });
  }
};

export default putEditArticle;
