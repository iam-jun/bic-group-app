import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import { ICreateArticleTagsState } from '..';
import { IGetSearchTags } from '~/interfaces/IArticle';

const getTags = (set, get) => async (isLoadMore :boolean, params?: IGetSearchTags) => {
  try {
    const listTag = get().listTag || {};

    if (isLoadMore && !listTag.hasNextPage) {
      return;
    }

    set((state: ICreateArticleTagsState) => {
      state.listTag.loading = true;
    }, 'getTags');

    const newParams = {
      ...params,
      offset: isLoadMore ? listTag?.items?.length : 0,
    };

    const response = await streamApi.searchTagsInAudiences(newParams);

    const listResult = response?.data?.list || [];
    const tags = isLoadMore ? [...listTag.items, ...listResult] : listResult;
    const hasNextPage = tags.length < (response?.data?.meta?.total || 0);

    set((state: ICreateArticleTagsState) => {
      state.listTag.loading = false;
      state.listTag.items = tags;
      state.listTag.hasNextPage = hasNextPage;
    }, 'getTagsSuccess');
  } catch (e) {
    set((state: ICreateArticleTagsState) => {
      state.listTag.loading = false;
    }, 'getTagsFailed');
    console.error('\x1b[35m🐣️ getTags error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default getTags;
