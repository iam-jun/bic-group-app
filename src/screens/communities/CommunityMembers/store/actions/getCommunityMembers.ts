import groupApi from '~/api/GroupApi';
import appConfig from '~/configs/appConfig';
import showError from '~/store/helper/showError';
import { ICommunityMemberState } from '..';

const getCommunityMembers = (set, get) => async (groupId: string, isRefreshing?: boolean) => {
  try {
    const { communityMembers }: ICommunityMemberState = get();
    const { canLoadMore, offset } = communityMembers || {};
    if (!isRefreshing && !canLoadMore) return;

    set((state: ICommunityMemberState) => {
      state.communityMembers.loading = isRefreshing ? true : offset === 0;
    }, 'getCommunityMembers');

    const params = {
      limit: appConfig.recordsPerPage,
      offset: isRefreshing ? 0 : offset,
    };

    const response = await groupApi.getGroupMembers(groupId, params);

    let newDataCount = 0;
    let newDataObj = {};

    const members = response.data;
    Object.keys(members)?.forEach?.((role: string) => {
      const roles = members[role] || {};
      newDataCount += roles.data?.length || 0;
      newDataObj = {
        ...newDataObj,
        [role]: {
          name: members[role]?.name,
          userCount: members[role]?.userCount,
          data:
            isRefreshing || !communityMembers?.[role]?.data
              ? [...roles.data || []]
              : [...communityMembers?.[role]?.data || [], ...roles.data || []],
        },
      };
    });

    const newData = {
      loading: false,
      canLoadMore: !!response?.meta?.hasNextPage,
      offset: isRefreshing ? newDataCount : offset + newDataCount,
      ...newDataObj,
    };

    set((state: ICommunityMemberState) => {
      state.communityMembers = newData;
    }, 'getCommunityMembersSuccess');
  } catch (error: any) {
    console.error(
      'getCommunityMembers error:', error,
    );
    set((state: ICommunityMemberState) => {
      state.communityMembers.loading = false;
    }, 'getCommunityMembersFailed');
    showError(error);
  }
};

export default getCommunityMembers;
