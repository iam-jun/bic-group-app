import streamApi from '~/api/StreamApi';
import { IGetSearchTags } from '~/interfaces/IArticle';
import showToastError from '~/store/helper/showToastError';
import { ICreateArticleTagsState } from '..';

const searchTags = (set, _get) => async (params: IGetSearchTags) => {
  set((state: ICreateArticleTagsState) => {
    state.search.loading = true;
    state.search.key = params?.name || '';
  }, 'searchTags');
  try {
    const response = await streamApi.searchTagsInAudiences(params);

    set((state: ICreateArticleTagsState) => {
      state.search.loading = false;
      state.search.items = response?.data?.list || [];
    }, 'searchTagsSuccess');
  } catch (e) {
    set((state: ICreateArticleTagsState) => {
      state.search.loading = false;
    }, 'searchTagsFailed');
    console.error('\x1b[35m🐣️ searchTags error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default searchTags;
