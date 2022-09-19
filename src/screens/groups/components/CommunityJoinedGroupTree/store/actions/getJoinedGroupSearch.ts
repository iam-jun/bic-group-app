import groupApi from '~/api/GroupApi';
import ICommunityJoinedGroupTreeState from '../Interface';

const getJoinedGroupSearch = (set, _get) => (id: string, key: string) => {
  set((state) => {
    state.loading = true;
  }, 'getJoinedGroupSearch');
  groupApi.getCommunityGroups(id, { listBy: 'flat', key }).then((response) => {
    set((state: ICommunityJoinedGroupTreeState) => {
      state.loading = false;
      state.searchResult = response.data || [];
    }, 'getJoinedGroupSearchSuccess');
  }).catch((error) => {
    console.error('\x1b[35m🐣️ getJoinedGroupSearch error ', error, '\x1b[0m');
    set((state) => {
      state.loading = false;
    }, 'getJoinedGroupSearchFailed');
  });
};

export default getJoinedGroupSearch;
