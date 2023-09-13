import groupApi from '~/api/GroupApi';
import useGeneralInformationStore from '~/screens/groups/GeneralInformation/store';
import useGroupsStore from '~/store/entities/groups';
import { IGroupDetailState } from '..';

const getGroupDetail = (set) => async (payload: { groupId: string }) => {
  try {
    const { groupId } = payload;
    set((state: IGroupDetailState) => {
      state.isLoadingGroupDetailError = false;
      state.loadingGroupDetail = true;
    }, 'getGroupDetail');

    const response = await groupApi.getGroupDetail(groupId);

    if (!response || !response.data) {
      set((state: IGroupDetailState) => {
        state.loadingGroupDetail = false;
      }, 'getGroupDetailEmptyData');
      return;
    }

    useGeneralInformationStore.getState().actions.setLoadingAvatar(false);
    useGeneralInformationStore.getState().actions.setLoadingCover(false);
    set((state: IGroupDetailState) => {
      state.loadingGroupDetail = false;
      state.isLoadingGroupDetailError = false;
    }, 'getGroupDetailSuccess');

    useGroupsStore.getState().actions.addToGroups(response.data);

    return response;
  } catch (err) {
    console.error('getGroupDetail:', err);
    set((state: IGroupDetailState) => {
      state.isLoadingGroupDetailError = true;
      state.loadingGroupDetail = false;
    }, 'getGroupDetailFailed');
  }
};

export default getGroupDetail;
