import IBaseStore from '~/store/interfaces/IBaseStore';

interface IRemoveGroupMemberState extends IBaseStore {
  actions: {
    deleteRemoveGroupMember: (payload: {groupId: string; userId: string}) => void;
  }
}

export default IRemoveGroupMemberState;
