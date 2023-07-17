import groupApi from '~/api/GroupApi';
import { IAdvancedNotiSettingsStore } from '../index';
import showToastError from '~/store/helper/showToastError';

const getJoinedGroupFlat = (set, get) => async (id: string) => {
  try {
    const {
      groupFlat, joinedGroups, actions, hasNextPage,
    } = get();
    if (!hasNextPage) return;

    if (Boolean(groupFlat?.[id]?.length > 0)) {
      set((state: IAdvancedNotiSettingsStore) => {
        state.joinedGroups = groupFlat[id];
      }, 'joinedGroupFlatHasYet');
      return;
    }
    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingJoinedGroup = true;
    }, 'getJoinedGroupFlat');

    const params: any = {
      listBy: 'flat',
      includeRootGroup: true,
      sort: 'level:asc',
      offset: joinedGroups.length,
    };
    const response = await groupApi.getCommunityGroups(id, params);

    const { data, meta } = response;
    const groupIds = data?.map((item: any) => item.id) || [];
    actions.getGroupSettings(groupIds);

    set((state: IAdvancedNotiSettingsStore) => {
      state.isLoadingJoinedGroup = false;
      state.joinedGroups = data || [];
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
