import { GroupPrivacyType } from '~/constants/privacyTypes';
import { IGroupDetail } from '~/interfaces/IGroup';
import useGroupsStore from '~/store/entities/groups';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore } from '~/store/utils';
import getGroupDetail from './actions/getGroupDetail';
import leaveGroup from './actions/leaveGroup';

export interface IGroupDetailState extends IBaseState {
  isLoadingGroupDetailError: boolean;
  loadingGroupDetail: boolean;
  actions: {
    leaveGroup: (groupId: string, privacy: GroupPrivacyType) => void;
    getGroupDetail: (payload: { groupId: string }) => Promise<any>;
    setGroupDetail: (payload: IGroupDetail | null) => void;
  };
}

const initialState: InitStateType<IGroupDetailState> = {
  isLoadingGroupDetailError: false,
  loadingGroupDetail: false,
};

const groupDetailStore = (set) => ({
  ...initialState,
  actions: {
    leaveGroup: leaveGroup(),
    getGroupDetail: getGroupDetail(set),
    setGroupDetail: (payload: IGroupDetail | null) => {
      set((state: IGroupDetailState) => {
        state.isLoadingGroupDetailError = initialState.isLoadingGroupDetailError;
        state.loadingGroupDetail = initialState.loadingGroupDetail;
      }, 'setGroupDetail');

      useGroupsStore.getState().actions.addToGroups(payload);
    },
  },
});

const useGroupDetailStore = createStore<IGroupDetailState>(groupDetailStore);

export default useGroupDetailStore;
