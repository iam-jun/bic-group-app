import { ICommunity } from '~/interfaces/ICommunity';
import IBaseState from '~/store/interfaces/IBaseState';

interface IJoinedCommunitiesState extends IBaseState{
  data?: ICommunity[],
  loading: boolean,
  getJoinedCommunities: (params?: {
    previewMembers?: boolean;
    managed?: boolean;
  }) => void;
}

export default IJoinedCommunitiesState;
