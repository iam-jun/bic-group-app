import { createStore } from '~/store/utils';
import removeGroupMember from './actions/removeGroupMember';
import IRemoveGroupMemberState from './Interface';

const removeGroupMemberStore = () => ({
  actions: {
    deleteRemoveGroupMember: removeGroupMember(),
  },
});

const useRemoveGroupMemberStore = createStore<IRemoveGroupMemberState>(removeGroupMemberStore);

export default useRemoveGroupMemberStore;
