import IHomeState from '~/screens/Home/store/Interface';
import ISelectAudienceState from '~/screens/post/PostSelectAudience/store/Interface';
import IChatState from '~/store/chat/IChatState';
import IJoinedCommunitiesState from '~/screens/Menu/store/Interface';
import IJoinedGroupTreeState from '~/screens/groups/store/Interface';
import IDraftPostState from '~/screens/post/DraftPost/store/Interface';

export interface BicStore {
  // screens
  post: {
    PostSelectAudience: {
      selectAudienceStore: ISelectAudienceState
    }
    DraftPost: {
      draftPostStore: IDraftPostState
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
