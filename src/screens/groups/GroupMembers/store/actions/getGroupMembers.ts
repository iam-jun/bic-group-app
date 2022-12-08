import groupApi from '~/api/GroupApi';
import appConfig from '~/configs/appConfig';
import { IGroupGetMembers } from '~/interfaces/IGroup';
import showError from '~/store/helper/showError';
import { IGroupMemberState } from '..';

const getGroupMembers = (set, get) => async (payload: IGroupGetMembers) => {
  try {
    const { groupId, params, isRefreshing } = payload;
    const { groupMembers } = get() || {};
    const { canLoadMore, offset } = groupMembers || {};

    set((state: IGroupMemberState) => {
      state.groupMembers.loading = isRefreshing ? true : offset === 0;
    }, 'getGroupMembers');

    if (!isRefreshing && !canLoadMore) return;

    const response = await groupApi.getGroupMembers(groupId, {
      limit: appConfig.recordsPerPage,
      offset: isRefreshing ? 0 : offset,
      ...params,
    });

    if (!response || !response.data) {
      set((state: IGroupMemberState) => {
        state.groupMembers.loading = false;
      }, 'getGroupMembers');
      return;
    }

    let newDataCount = 0;
    let newDataObj = {};
    const members = response.data;
    Object.keys(members)?.forEach?.((role: string) => {
      newDataCount += members[role]?.data?.length || 0;
      newDataObj = {
        ...newDataObj,
        [role]: {
          name: members[role]?.name,
          userCount: members[role]?.userCount,
          data:
            isRefreshing || !groupMembers?.[role]?.data
              ? [...(members[role]?.data || [])]
              : [...(groupMembers?.[role]?.data || []), ...(members[role]?.data || [])],
        },
      };
    });

    const newData = {
      loading: false,
      canLoadMore: !!response?.meta?.hasNextPage,
      offset: isRefreshing ? newDataCount : offset + newDataCount,
      ...newDataObj,
    };

    set((state: IGroupMemberState) => {
      state.groupMembers = newData;
    }, 'getGroupMembers');
  } catch (e) {
    console.error('\x1b[31m🐣️ getGroupMembers error: ', e, '\x1b[0m');
    set((state: IGroupMemberState) => {
      state.groupMembers.loading = false;
    }, 'getGroupMembers');
    showError(e);
  }
};

export default getGroupMembers;
