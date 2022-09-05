import { ICommunity } from '~/interfaces/ICommunity';

interface IJoinedCommunitiesState {
  data?: ICommunity[],
  loading: boolean,
  getJoinedCommunities: (params?: {
    previewMembers?: boolean;
    managed?: boolean;
  }) => void;
  reset: () => void;
}

export default IJoinedCommunitiesState;
