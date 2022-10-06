import IBaseState from '~/store/interfaces/IBaseState';

interface IRemoveCommunityMemberState extends IBaseState {
  actions: {
    deleteRemoveCommunityMember: (payload: {communityId: string; userId: string}) => void;
  }
}

export default IRemoveCommunityMemberState;
