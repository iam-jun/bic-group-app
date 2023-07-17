import groupApi from '~/api/GroupApi';
import { IAdvancedNotiSettingsStore } from '../index';
import showToastError from '~/store/helper/showToastError';
import { IGetCommunityGroup } from '~/interfaces/IGroup';

const searchJoinedGroupFlat = (set, get) => async (params: IGetCommunityGroup, isRefresh?:boolean) => {
  try {
    const {
      searchJoinedGroups, actions, hasSearchNextPage, selectedCommunity,
    } = get();
    if (!hasSearchNextPage && !isRefresh) return;
    const id = selectedCommunity?.id;

    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingJoinedGroup = true;
      state.hasSearchNextPage = isRefresh ? true : state.hasSearchNextPage;
    }, 'searchJoinedGroupFlat');

    const newParams: any = {
      ...params,
      listBy: 'flat',
      includeRootGroup: true,
      offset: isRefresh ? 0 : searchJoinedGroups.length,
      communityId: id,
    };

    const response = await groupApi.getCommunityGroups(id, newParams);

    const { data, meta } = response;
    const groupIds = data?.map((item: any) => item.id) || [];
    actions.getGroupSettings(groupIds);

    const newData = isRefresh ? data : [...searchJoinedGroups, ...data];

    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingJoinedGroup = false;
      state.searchJoinedGroups = newData;
      state.hasSearchNextPage = meta.hasNextPage;
    }, 'searchJoinedGroupFlatSuccess');
  } catch (error) {
    console.error('\x1b[35m🐣️ search joined group flat error ', error, '\x1b[0m');
    showToastError(error);
    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingJoinedGroup = false;
      state.searchJoinedGroups = [];
    }, 'searchJoinedGroupFlatFailed');
  }
};

export default searchJoinedGroupFlat;
