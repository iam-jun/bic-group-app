import { ContentType } from '~/components/SelectAudience';
import groupApi from '~/api/GroupApi';
import { ISelectAudienceState } from '..';
import showToastError from '~/store/helper/showToastError';

const getAudienceSearch = (set, get) => async (
  key: string,
  contentType: ContentType,
  isRefresh = true,
) => {
  const { search }: ISelectAudienceState = get();
  const { data = [], loading } = search || {};

  if (!contentType || loading) return;

  set((state: ISelectAudienceState) => {
    state.search.loading = true;
    state.search.key = key;
    state.search.contentType = contentType;
  }, 'action getAudienceSearch');

  try {
    const params = {
      key,
      contentType,
      offset: isRefresh ? 0 : data?.length || 0,
      limit: 15,
    };
    const response = await groupApi.getSearchAudiences(params);

    const newData = isRefresh ? response?.data : data?.concat(response?.data || []);

    set((state: ISelectAudienceState) => {
      state.search = {
        key,
        loading: false,
        hasNextPage: response?.meta?.hasNextPage,
        data: newData as any,
        contentType,
      };
    }, 'action getAudienceSearch Success');
  } catch (e) {
    set((state: ISelectAudienceState) => {
      state.search = {
        key,
        loading: false,
        hasNextPage: false,
        data: undefined,
        contentType: undefined,
      };
    }, 'action getAudienceSearch Error');
    console.error('\x1b[31m🐣️ action getAudienceSearch error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default getAudienceSearch;
