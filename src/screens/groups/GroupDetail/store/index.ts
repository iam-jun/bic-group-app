import { GroupPrivacyType } from '~/constants/privacyTypes';
import IBaseState from '~/store/interfaces/IBaseState';
import { createStore } from '~/store/utils';
import leaveGroup from './actions/leaveGroup';

export interface IGroupDetailState extends IBaseState {
  actions: {
    leaveGroup: (groupId: string, privacy: GroupPrivacyType) => void;
  },
}

const groupDetailStore = () => ({
  actions: {
    leaveGroup: leaveGroup(),
  },
});

const useGroupDetailStore = createStore<IGroupDetailState>(groupDetailStore);

export default useGroupDetailStore;
