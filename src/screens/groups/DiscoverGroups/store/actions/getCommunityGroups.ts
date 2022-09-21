import groupApi from '~/api/GroupApi';
import IDiscoverGroupsState from '../Interface';

const getCommunityGroups = (set, _get) => async (communityId: string) => {
  try {
    const response = await
    groupApi.getCommunityGroups(communityId, { key: '' });
    const groups = response?.data || [];
    set((state: IDiscoverGroupsState) => {
      state.noGroupInCommuntity = groups.length === 0;
    }, 'getCommunityGroupsSuccess');
  } catch (err) {
    console.error(
      'getCommunityGroups error:', err,
    );
    set((state: IDiscoverGroupsState) => {
      state.noGroupInCommuntity = true;
    }, 'getCommunityGroupsSuccess');
  }
};

export default getCommunityGroups;
