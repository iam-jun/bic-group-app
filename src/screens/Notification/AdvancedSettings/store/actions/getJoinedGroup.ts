import { IAdvancedNotiSettingsStore } from '../index';
import showToastError from '~/store/helper/showToastError';
import notificationApi from '~/api/NotificationApi';
import { IGroupNotificationSetting } from '~/interfaces/INotification';
import appConfig from '~/configs/appConfig';

const getJoinedGroup = (set, get) => async (id: string, isRefresh?: boolean) => {
  try {
    const {
      joinedGroups, hasNextPage,
    } = get();
    if (!hasNextPage && !isRefresh) return;

    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingJoinedGroup = true;
      state.hasNextPage = isRefresh ? true : state.hasSearchNextPage;
      state.joinedGroups = isRefresh ? [] : state.joinedGroups;
    }, 'getJoinedGroup');

    const params: any = {
      listBy: 'flat',
      includeRootGroup: true,
      sort: 'level:asc',
      offset: isRefresh ? 0 : joinedGroups.length,
      limit: isRefresh ? appConfig.limitGroupAdvancedSettings * 2 : appConfig.limitGroupAdvancedSettings,
    };

    const response = await notificationApi.getGroupsAndGroupsSettings(id, params);
    const { data } = response;
    const groupdData = data?.groups || [];
    const newIds = groupdData.map((item) => item.id);
    const newData = isRefresh ? newIds : [...joinedGroups, ...newIds];

    const newGroupData = {};
    groupdData.forEach((item: IGroupNotificationSetting) => {
      newGroupData[item?.id] = { ...item };
    });

    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingJoinedGroup = false;
      state.joinedGroups = newData;
      state.searchJoinedGroups = newData;
      state.hasNextPage = data.metadata.hasNextPage;
      state.hasSearchNextPage = data.metadata.hasNextPage;
      state.groupData = { ...state.groupData, ...newGroupData };
    }, 'getJoinedGroupSuccess');
  } catch (error) {
    console.error('\x1b[35m🐣️ search joined group flat error ', error, '\x1b[0m');
    showToastError(error);
    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingJoinedGroup = false;
      state.joinedGroups = [];
      state.searchJoinedGroups = [];
    }, 'getJoinedGroupFailed');
  }
};

export default getJoinedGroup;
