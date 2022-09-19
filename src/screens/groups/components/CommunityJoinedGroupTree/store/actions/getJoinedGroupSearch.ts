import groupApi from '~/api/GroupApi';
import { IGetCommunityGroup } from '~/interfaces/IGroup';
import ICommunityJoinedGroupTreeState from '../Interface';

const LIMIT = 20;

const getJoinedGroupSearch = (set, get) => (id: string, key: string, isLoadMore?: boolean) => {
  set((state) => {
    state.loading = true;
  }, 'getJoinedGroupSearch');

  const { searchResult = [] } = get() || {};

  const params: IGetCommunityGroup = { listBy: 'flat', key, limit: LIMIT };
  let offset = 0;
  if (isLoadMore) {
    offset = searchResult?.length || 0;
  }
  params.offset = offset;

  groupApi.getCommunityGroups(id, params).then((response) => {
    set((state: ICommunityJoinedGroupTreeState) => {
      state.searchResult = isLoadMore ? searchResult?.concat?.(response?.data) : response?.data;
      state.loading = false;
      state.searchHasNextPage = response?.meta?.hasNextPage;
    }, 'getJoinedGroupSearchSuccess');
  }).catch((error) => {
    console.error('\x1b[35m🐣️ getJoinedGroupSearch error ', error, '\x1b[0m');
    set((state) => {
      state.loading = false;
    }, 'getJoinedGroupSearchFailed');
  });
};

export default getJoinedGroupSearch;
