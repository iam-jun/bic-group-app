import groupApi from '~/api/GroupApi';
import appConfig from '~/configs/appConfig';
import { IJoinableUsers, IParamsGetJoinableUsers } from '~/interfaces/IGroup';
import { mapItems } from '~/screens/groups/helper/mapper';
import showToastError from '~/store/helper/showToastError';
import { IGroupJoinableUsersState } from '..';

const getGroupJoinableUsers = (set, get) => async (payload: IParamsGetJoinableUsers) => {
  const { groupId, key, isLoadMore } = payload;
  try {
    const { users, data }: IGroupJoinableUsersState = get();
    const { ids, hasNextPage } = users;
    if (isLoadMore && !hasNextPage) return;

    if (!isLoadMore) {
      // clear data every time user types a new search text
      set((state: IGroupJoinableUsersState) => {
        state.users.ids = [];
        state.users.loading = true;
      }, 'getGroupJoinableUsersLoading');
    }

    const params = {
      key,
      offset: isLoadMore ? ids.length : 0,
      limit: appConfig.recordsPerPage,
    };
    const response = await groupApi.getJoinableUsers(groupId, params);
    const responseData = response.data || [];

    const userIds = responseData.map((item: IJoinableUsers) => item.id);
    const userData = mapItems(responseData);

    const newUserIds = isLoadMore ? ids.concat(userIds) : userIds;
    const newUserData = { ...data, ...userData };

    set((state: IGroupJoinableUsersState) => {
      state.data = newUserData;
      state.users = {
        loading: false,
        ids: newUserIds,
        hasNextPage: !!response?.meta?.hasNextPage,
      };
    }, 'getGroupJoinableUsersSuccess');
  } catch (error) {
    console.error('getGroupJoinableUsers error:', error);
    set((state: IGroupJoinableUsersState) => {
      state.users.loading = false;
    }, 'getGroupJoinableUsersError');
    showToastError(error);
  }
};

export default getGroupJoinableUsers;
