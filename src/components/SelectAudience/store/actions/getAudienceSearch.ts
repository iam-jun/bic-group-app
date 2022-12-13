import { ContentType } from '~/components/SelectAudience';
import groupApi from '~/api/GroupApi';
import { ISelectAudienceState } from '..';

const getAudienceSearch = (set, _) => async (key: string, contentType: ContentType) => {
  set((state: ISelectAudienceState) => {
    state.search.loading = true;
    state.search.key = key;
    state.search.contentType = contentType;
  });
  if (!key || !contentType) {
    set((state: ISelectAudienceState) => {
      state.search = {
        key,
        loading: false,
        data: undefined,
        contentType: undefined,
      };
    });
    return;
  }
  try {
    const params = { key, contentType };
    const response = await groupApi.getSearchAudiences(params);
    set((state: ISelectAudienceState) => {
      state.search = {
        key,
        loading: false,
        data: response?.data || [],
        contentType,
      };
    }, 'getAudienceSearch');
  } catch (e) {
    set((state: ISelectAudienceState) => {
      state.search = {
        key,
        loading: false,
        data: undefined,
        contentType: undefined,
      };
    }, 'getAudienceSearch');
  }
};

export default getAudienceSearch;
