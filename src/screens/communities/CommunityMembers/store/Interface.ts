import IBaseStore from '~/store/interfaces/IBaseStore';

interface IRemoveCommunityMemberState extends IBaseStore {
  actions: {
    deleteRemoveCommunityMember: (payload: {communityId: string; userId: string}) => void;
  }
}

export default IRemoveCommunityMemberState;
