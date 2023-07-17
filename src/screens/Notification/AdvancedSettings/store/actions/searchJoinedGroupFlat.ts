import groupApi from '~/api/GroupApi';
import { IAdvancedNotiSettingsStore } from '../index';
import showToastError from '~/store/helper/showToastError';
import { IGetCommunityGroup } from '~/interfaces/IGroup';

const searchJoinedGroupFlat = (set, get) => async (id: string, params: IGetCommunityGroup) => {
  try {
    const {
      searchJoinedGroups, actions, hasSearchNextPage,
    } = get();
    if (!hasSearchNextPage) return;

    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingJoinedGroup = true;
    }, 'searchJoinedGroupFlat');

    const newParams: any = {
      ...params,
      listBy: 'flat',
      includeRootGroup: true,
      offset: searchJoinedGroups.length,
      communityId: id,
    };

    const response = await groupApi.getCommunityGroups(id, newParams);

    const { data, meta } = response;
    const groupIds = data?.map((item: any) => item.id) || [];
    actions.getGroupSettings(groupIds);

    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingJoinedGroup = false;
      state.searchJoinedGroups = data || [];
      state.hasSearchNextPage = meta.hasNextPage;
    }, 'searchJoinedGroupFlatSuccess');
  } catch (error) {
    console.error('\x1b[35m🐣️ joinedGroupTree error ', error, '\x1b[0m');
    showToastError(error);
    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingJoinedGroup = false;
      state.searchJoinedGroups = [];
    }, 'searchJoinedGroupFlatFailed');
  }
};

export default searchJoinedGroupFlat;
