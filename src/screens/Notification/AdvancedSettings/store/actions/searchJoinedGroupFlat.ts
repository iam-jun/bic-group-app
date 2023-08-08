import { IAdvancedNotiSettingsStore } from '../index';
import showToastError from '~/store/helper/showToastError';
import { IGetCommunityGroup } from '~/interfaces/IGroup';
import notificationApi from '~/api/NotificationApi';
import appConfig from '~/configs/appConfig';

const searchJoinedGroupFlat = (set, get) => async (params: IGetCommunityGroup, isRefresh?:boolean) => {
  try {
    const {
      searchJoinedGroups, hasSearchNextPage, selectedCommunity,
    } = get();
    if (!hasSearchNextPage && !isRefresh) return;
    const id = selectedCommunity?.communityId || selectedCommunity?.id;

    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingSearchJoinedGroup = true;
      state.hasSearchNextPage = isRefresh ? true : state.hasSearchNextPage;
    }, 'searchJoinedGroupFlat');

    const newParams: any = {
      ...params,
      listBy: 'flat',
      includeRootGroup: true,
      offset: isRefresh ? 0 : searchJoinedGroups.length,
      limit: appConfig.limitGroupAdvancedSettings,
    };

    const response = await notificationApi.getGroupsAndGroupsSettings(id, newParams);
    const { data } = response;
    const groupdData = data?.groups || [];
    const newData = isRefresh ? groupdData : [...searchJoinedGroups, ...groupdData];

    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingSearchJoinedGroup = false;
      state.searchJoinedGroups = newData;
      state.hasSearchNextPage = data.metadata.hasNextPage;
    }, 'searchJoinedGroupFlatSuccess');
  } catch (error) {
    console.error('\x1b[35m🐣️ search joined group flat error ', error, '\x1b[0m');
    showToastError(error);
    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingSearchJoinedGroup = false;
      state.searchJoinedGroups = [];
    }, 'searchJoinedGroupFlatFailed');
  }
};

export default searchJoinedGroupFlat;
