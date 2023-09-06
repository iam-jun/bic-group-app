import appConfig from '~/configs/appConfig';
import showToastError from '~/store/helper/showToastError';
import { IParamsGetInvitations } from '~/interfaces/IGroup';
import groupApi from '~/api/GroupApi';
import { IGroupJoinableUsersState } from '../index';

const getInvitations
  = (set, get) => async (groupId: string, isRefreshing = false) => {
    try {
      const { invitedPeople }: IGroupJoinableUsersState = get();
      const { cursors, data } = invitedPeople || {};

      set((state: IGroupJoinableUsersState) => {
        if (isRefreshing) {
          state.invitedPeople.isRefreshing = true;
        } else {
          state.invitedPeople.isLoading = true;
        }
      }, 'getInvitations Fetching');

      const params: IParamsGetInvitations = {
        limit: appConfig.recordsPerPage,
        cursor: isRefreshing ? null : cursors?.next,
      };

      const response = await groupApi.getInvitations(groupId, params);

      const members = response.data;
      const newData: IGroupJoinableUsersState['invitedPeople'] = {
        data: isRefreshing ? members : data.concat(members),
        cursors: response?.meta?.cursors,
        isLoading: false,
        isRefreshing: false,
      };

      set((state: IGroupJoinableUsersState) => {
        state.invitedPeople = newData;
      }, 'getInvitations Success');
    } catch (error: any) {
      console.error('getInvitations error:', error);
      set((state: IGroupJoinableUsersState) => {
        state.invitedPeople.isRefreshing = false;
        state.invitedPeople.isLoading = false;
      }, 'getInvitations Failed');
      showToastError(error);
    }
  };

export default getInvitations;
