import groupApi from '~/api/GroupApi';
import { IAdvancedNotiSettingsStore, MAX_GROUP_LIMIT } from '../index';
import showToastError from '~/store/helper/showToastError';

const getJoinedGroupFlat = (set, get) => async (id: string, isRefresh?: boolean) => {
  try {
    const { joinedGroups, actions, hasNextPage } = get();
    if (!hasNextPage && !isRefresh) return;

    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingJoinedGroup = true;
      state.hasNextPage = isRefresh ? true : state.hasNextPage;
    }, 'getJoinedGroupFlat');

    const params: any = {
      listBy: 'flat',
      includeRootGroup: true,
      sort: 'level:asc',
      offset: isRefresh ? 0 : joinedGroups.length,
      limit: MAX_GROUP_LIMIT,
    };

    const response = await groupApi.getCommunityGroups(id, params);

    const { data, meta } = response;
    const groupIds = data?.map((item: any) => item.id) || [];
    actions.getGroupSettings(groupIds);
    const newData = isRefresh ? data : [...joinedGroups, ...data];

    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingJoinedGroup = false;
      state.joinedGroups = newData;
      state.searchJoinedGroups = newData;
      state.hasNextPage = meta.hasNextPage;
    }, 'getJoinedGroupFlatSuccess');
  } catch (error) {
    console.error('\x1b[35m🐣️ joinedGroupTree error ', error, '\x1b[0m');
    showToastError(error);
    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingJoinedGroup = false;
      state.joinedGroups = [];
    }, 'getJoinedGroupFlatFailed');
  }
};

export default getJoinedGroupFlat;
