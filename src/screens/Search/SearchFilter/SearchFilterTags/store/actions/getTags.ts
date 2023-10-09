/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import { ISearchFilterTagsState } from '..';
import appConfig from '~/configs/appConfig';
import { ParamsSearchTags } from '~/interfaces/ISearch';

const getTags = (set, get) => async (key: string, isRefresh?: boolean) => {
  try {
    const { data }: ISearchFilterTagsState = get();
    const { loading, hasNextPage, tags } = data;

    if (loading || (!hasNextPage && !isRefresh)) {
      return;
    }

    set((state: ISearchFilterTagsState) => {
      state.data.key = key;
      state.data.loading = true;
    }, 'getTags');

    const params: ParamsSearchTags = {
      keyword: key,
    //   offset: isRefresh ? 0 : tags.length,
    //   limit: appConfig.recordsPerPage,
    };

    const response = await streamApi.searchTags(params);

    const listResult = response?.data?.list || [];
    const newTags = isRefresh ? listResult : [...tags, ...listResult];

    set((state: ISearchFilterTagsState) => {
      state.data.loading = false;
      state.data.tags = newTags;
      //   state.data.hasNextPage = response?.meta?.hasNextPage;
      state.data.hasNextPage = false;
    }, 'getTags Success');
  } catch (e) {
    set((state: ISearchFilterTagsState) => {
      state.data.loading = false;
    }, 'getTags failed');
    console.error('\x1b[35m🐣️ getTags error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default getTags;
