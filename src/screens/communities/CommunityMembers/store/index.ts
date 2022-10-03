import { createStore } from '~/store/utils';
import removeCommunityMember from './actions/removeCommunityMember';
import IRemoveCommunityMemberState from './Interface';

const removeCommunityMemberStore = () => ({
  actions: {
    deleteRemoveCommunityMember: removeCommunityMember(),
  },
});

const useRemoveCommunityMemberStore = createStore<IRemoveCommunityMemberState>(removeCommunityMemberStore);

export default useRemoveCommunityMemberStore;
