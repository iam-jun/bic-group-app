import IHomeState from '~/screens/Home/store/IHomeState';
import ISelectAudienceState from '~/screens/post/PostSelectAudience/store/Interface';
import IChatState from '~/store/chat/IChatState';
import IJoinedCommunitiesState from '~/screens/Menu/store/IJoinedCommunitiesState';
import IJoinedGroupTreeState from '~/screens/groups/store/IJoinedGroupTreeState';

export interface BicStore {
  // screens
  post: {
    PostSelectAudience: {
      selectAudienceStore: ISelectAudienceState
    }
  }
  groups: {
    joinedGroupTreeStore: IJoinedGroupTreeState
  }
  Home: {
    homeStore: IHomeState,
  }
  Menu: {
    joinedCommunitiesStore: IJoinedCommunitiesState
  }

  // others
  chat: IChatState
}
