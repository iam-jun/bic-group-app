import IHomeState from '~/store/interface/IHomeState';
import { IJoinedCommunitiesState } from '~/screens/Menu/store/joinedCommunities';
import ISelectAudienceState from '~/screens/post/PostSelectAudience/store/ISelectAudienceState';

export interface BicStore {
  home: IHomeState
  joinedCommunities: IJoinedCommunitiesState
  post: {
    selectAudience: ISelectAudienceState
  }
}
