import IBaseState from '~/store/interfaces/IBaseState';

interface IRemoveGroupMemberState extends IBaseState {
  actions: {
    deleteRemoveGroupMember: (payload: {groupId: string; userId: string}) => void;
  }
}

export default IRemoveGroupMemberState;
