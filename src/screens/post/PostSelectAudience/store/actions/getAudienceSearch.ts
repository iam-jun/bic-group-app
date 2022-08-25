import groupApi from '~/api/GroupApi';
import ISelectAudienceState from '~/screens/post/PostSelectAudience/store/ISelectAudienceState';

const getAudienceSearch = (set, _) => async (key: string) => {
  set((state: ISelectAudienceState) => {
    state.search.loading = true;
    state.search.key = key;
  }, false, 'getAudienceSearch');
  if (!key) {
    set((state: ISelectAudienceState) => {
      state.search = {
        key,
        loading: false,
        data: undefined,
      };
    }, false, 'getAudienceSearch');
    return;
  }
  try {
    const params = { key };
    const response = await groupApi.getSearchAudiences(params);
    set((state: ISelectAudienceState) => {
      state.search = {
        key,
        loading: false,
        data: response?.data || [],
      };
    }, false, 'getAudienceSearch');
  } catch (e) {
    set((state: ISelectAudienceState) => {
      state.search = {
        key,
        loading: false,
        data: undefined,
      };
    }, false, 'getAudienceSearch');
  }
};

export default getAudienceSearch;
