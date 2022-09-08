import { ICommunity } from '~/interfaces/ICommunity';
import IBaseStore from '~/store/interfaces/IBaseStore';

interface IJoinedCommunitiesState extends IBaseStore{
  data?: ICommunity[],
  loading: boolean,
  getJoinedCommunities: (params?: {
    previewMembers?: boolean;
    managed?: boolean;
  }) => void;
}

export default IJoinedCommunitiesState;
