import groupApi from '~/api/GroupApi';
import { ISelectAudienceState } from '..';
import showToastError from '~/store/helper/showToastError';

const getAllGroupJoinedSearch
  = (set, get) => async (key: string, isRefresh = true) => {
    const { search }: ISelectAudienceState = get();
    const { data = [], loading } = search || {};

    if (loading) return;

    set((state: ISelectAudienceState) => {
      state.search.loading = true;
      state.search.key = key;
    }, 'getAllGroupJoinedSearch');

    try {
      const params = {
        key,
        offset: isRefresh ? 0 : data?.length || 0,
        limit: 15,
      };
      const response = await groupApi.getAllGroupJoinedSearch(params);

      const newData = isRefresh
        ? response?.data
        : data?.concat(response?.data || []);

      set((state: ISelectAudienceState) => {
        state.search = {
          key,
          loading: false,
          hasNextPage: response?.meta?.hasNextPage,
          data: newData as any,
        };
      }, 'getAllGroupJoinedSearch Success');
    } catch (e) {
      set((state: ISelectAudienceState) => {
        state.search = {
          key,
          loading: false,
          hasNextPage: false,
          data: undefined,
        };
      }, 'getAllGroupJoinedSearch Error');
      console.error(
        '\x1b[31m🐣️ action getAllGroupJoinedSearch error: ',
        e,
        '\x1b[0m',
      );
      showToastError(e);
    }
  };

export default getAllGroupJoinedSearch;
