import groupApi from '~/api/GroupApi';
import { IAdvancedNotiSettingsStore } from '../index';

const getJoinedGroupFlat = (set, get) => async (id: string) => {
  try {
    const { groupFlat } = get();
    if (Boolean(groupFlat?.[id]?.length > 0)) {
      set((state: IAdvancedNotiSettingsStore) => {
        state.joinedGroups = groupFlat[id];
      }, 'joinedGroupFlatHasYet');
      return;
    }
    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingJoinedGroup = true;
    }, 'getJoinedGroupFlat');

    const params: any = { listBy: 'flat', includeRootGroup: true, sort: 'level:asc' };
    const response = await groupApi.getCommunityGroups(id, params);
    const newData: any = { id: response.data || [] };

    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingJoinedGroup = false;
      state.groupData = { ...state.groupData, ...newData };
      state.joinedGroups = response?.data || [];
    }, 'getJoinedGroupFlatSuccess');
  } catch (error) {
    console.error('\x1b[35m🐣️ joinedGroupTree error ', error, '\x1b[0m');
    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingJoinedGroup = false;
    }, 'getJoinedGroupFlatFailed');
  }
};

export default getJoinedGroupFlat;
