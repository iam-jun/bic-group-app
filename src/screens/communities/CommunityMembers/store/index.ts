import { createStore } from '~/store/utils';
import removeCommunityMember from './actions/removeCommunityMember';
import IBaseState from '~/store/interfaces/IBaseState';

export interface IRemoveCommunityMemberState extends IBaseState {
  actions: {
    deleteRemoveCommunityMember: (payload: {communityId: string; groupId: string; userId: string}) => void;
  }
}

const removeCommunityMemberStore = () => ({
  actions: {
    deleteRemoveCommunityMember: removeCommunityMember(),
  },
});

const useRemoveCommunityMemberStore = createStore<IRemoveCommunityMemberState>(removeCommunityMemberStore);

export default useRemoveCommunityMemberStore;
