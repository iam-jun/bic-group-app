import groupApi from '~/api/GroupApi';
import appConfig from '~/configs/appConfig';
import { IJoinableUsers, IParamsGetJoinableUsers } from '~/interfaces/IGroup';
import { mapItems } from '~/screens/groups/helper/mapper';
import showToastError from '~/store/helper/showToastError';
import { IGroupJoinableUsersState } from '../index';

const getGroupJoinableUsers = (set, get) => async (payload: IParamsGetJoinableUsers) => {
  const { groupId, key, isLoadMore } = payload;
  try {
    const { users, data }: IGroupJoinableUsersState = get();
    const { ids } = users;

    set((state: IGroupJoinableUsersState) => {
      state.users.loading = true;
    }, 'getGroupJoinableUsers Fetching');

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
    }, 'getGroupJoinableUsers Success');
  } catch (error) {
    console.error('getGroupJoinableUsers error:', error);
    set((state: IGroupJoinableUsersState) => {
      state.users.loading = false;
    }, 'getGroupJoinableUsers Failed');
    showToastError(error);
  }
};

export default getGroupJoinableUsers;
