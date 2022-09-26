import groupApi from '~/api/GroupApi';
import IDiscoverGroupsState from '../Interface';

const getCommunityGroups = (set, _get) => async (communityId: string) => {
  try {
    set((state: IDiscoverGroupsState) => {
      state.loading = true;
    }, 'getCommunityGroups');
    const response = await
    groupApi.getCommunityGroups(communityId, { key: '' });
    const groups = response?.data || [];
    set((state: IDiscoverGroupsState) => {
      state.noGroupInCommuntity = groups.length === 0;
      state.loading = false;
    }, 'getCommunityGroupsSuccess');
  } catch (err) {
    console.error(
      'getCommunityGroups error:', err,
    );
    set((state: IDiscoverGroupsState) => {
      state.noGroupInCommuntity = true;
      state.loading = false;
    }, 'getCommunityGroupsError');
  }
};

export default getCommunityGroups;
