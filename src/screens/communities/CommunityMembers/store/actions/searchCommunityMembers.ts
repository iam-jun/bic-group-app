import groupApi from '~/api/GroupApi';
import appConfig from '~/configs/appConfig';
import { ISearchCommunityMembers } from '~/interfaces/ICommunity';
import showError from '~/store/helper/showError';

const searchCommunityMembers = (set, get) => async (
  { isLoadMore = false, key, groupId }: ISearchCommunityMembers,
) => {
  try {
    const { search } = get();
    const { canLoadMore, data } = search;
    if (!!isLoadMore && !canLoadMore) return;

    set((state) => {
      state.search.loading = !isLoadMore;
      state.search.data = isLoadMore ? data : [];
    }, 'searchCommunityMembersLoading');

    const params = {
      limit: appConfig.recordsPerPage,
      offset: isLoadMore ? data.length : 0,
      key,
    };

    const response = await groupApi.getGroupMembers(groupId, params);
    const members = response?.data || [];

    let newDataArr: any = [];

    Object.keys(members)?.forEach?.((role: string) => {
      newDataArr = [...newDataArr, ...members[role]?.data || []];
    });

    const result = isLoadMore ? [...data, ...newDataArr] : newDataArr;

    // update search results data
    set((state) => {
      state.search.loading = false;
      state.search.data = result;
      state.search.canLoadMore = !!response?.meta?.hasNextPage;
    }, 'searchCommunityMembersSuccess');
  } catch (err: any) {
    console.error(
      'searchCommunityMembers error:', err,
    );
    set((state) => {
      state.search.loading = false;
    }, 'searchCommunityMembersFailed');
    showError(err);
  }
};

export default searchCommunityMembers;
