import IHomeState from '~/store/interface/IHomeState';
import { IJoinedCommunitiesState } from '~/screens/Menu/store/joinedCommunities';

export interface BicStore {
  home: IHomeState
  joinedCommunities: IJoinedCommunitiesState
}
