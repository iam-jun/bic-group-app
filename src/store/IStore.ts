import IHomeState from '~/screens/Home/store/Interface';
import ISelectAudienceState from '~/screens/post/PostSelectAudience/store/Interface';
import IChatState from '~/store/chat/IChatState';
import IJoinedCommunitiesState from '~/screens/Menu/store/Interface';
import IJoinedGroupTreeState from '~/screens/groups/store/Interface';
import IDraftPostState from '~/screens/post/DraftPost/store/Interface';
import ILeaveCommunityState from '~/screens/communities/CommunityDetail/store/interface';

export interface BicStore {
  // screens
  post: {
    PostSelectAudience: {
      selectAudienceStore: ISelectAudienceState
    }
    DraftPost: {
      draftPostStore: IDraftPostState
    }
  },
  communities: {
    leaveCommunity: ILeaveCommunityState,
  },
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
