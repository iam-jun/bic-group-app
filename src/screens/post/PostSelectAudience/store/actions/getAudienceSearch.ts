import groupApi from '~/api/GroupApi';
import ISelectAudienceState from '../Interface';

const getAudienceSearch = (set, _) => async (key: string) => {
  set((state: ISelectAudienceState) => {
    state.search.loading = true;
    state.search.key = key;
  });
  if (!key) {
    set((state: ISelectAudienceState) => {
      state.search = {
        key,
        loading: false,
        data: undefined,
      };
    });
    return;
  }
  try {
    const params = { key, limit: 100 }; // todo lazy load
    const response = await groupApi.getSearchAudiences(params);
    set((state: ISelectAudienceState) => {
      state.search = {
        key,
        loading: false,
        data: response?.data || [],
      };
    }, 'getAudienceSearch');
  } catch (e) {
    set((state: ISelectAudienceState) => {
      state.search = {
        key,
        loading: false,
        data: undefined,
      };
    }, 'getAudienceSearch');
  }
};

export default getAudienceSearch;
