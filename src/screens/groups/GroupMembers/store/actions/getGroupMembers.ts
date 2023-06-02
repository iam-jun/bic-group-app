import groupApi from '~/api/GroupApi';
import appConfig from '~/configs/appConfig';
import { IGroupGetMembers } from '~/interfaces/IGroup';
import showToastError from '~/store/helper/showToastError';
import { IGroupMemberState } from '..';

const getGroupMembers = (set, get) => async (payload: IGroupGetMembers) => {
  try {
    const { groupId, params, isRefreshing } = payload;
    const { groupMembers }: IGroupMemberState = get() || {};
    const { loading, canLoadMore, offset } = groupMembers || {};
    if (loading || (!isRefreshing && !canLoadMore)) return;

    set((state: IGroupMemberState) => {
      if (isRefreshing) {
        state.groupMembers.refreshing = true;
      } else {
        state.groupMembers.loading = true;
      }
    }, 'getGroupMembers');

    const response = await groupApi.getGroupMembers(groupId, {
      limit: appConfig.recordsPerPage,
      offset: isRefreshing ? 0 : offset,
      ...params,
    });

    if (!response || !response.data) {
      set((state: IGroupMemberState) => {
        state.groupMembers.loading = false;
        state.groupMembers.refreshing = false;
      }, 'getGroupMembersFailed');
      return;
    }

    const { newDataCount, newDataObj } = handleNewData({ isRefreshing, response, groupMembers });

    const newData = {
      loading: false,
      refreshing: false,
      canLoadMore: !!response?.meta?.hasNextPage,
      offset: isRefreshing ? newDataCount : offset + newDataCount,
      ...newDataObj,
    };

    set((state: IGroupMemberState) => {
      state.groupMembers = newData;
    }, 'getGroupMembersSuccess');
  } catch (e) {
    console.error('\x1b[31m🐣️ getGroupMembers error: ', e, '\x1b[0m');
    set((state: IGroupMemberState) => {
      state.groupMembers.loading = false;
      state.groupMembers.refreshing = false;
    }, 'getGroupMembersFailed');
    showToastError(e);
  }
};

const handleNewData = (params: { isRefreshing: boolean; response: any; groupMembers: IGroupMemberState['groupMembers'] }) => {
  const { isRefreshing, response, groupMembers } = params;
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
  return { newDataCount, newDataObj };
};

export default getGroupMembers;
