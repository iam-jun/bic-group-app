import IHomeState from '~/screens/Home/store/Interface';
import ISelectAudienceState from '~/screens/post/PostSelectAudience/store/Interface';
import IChatState from '~/store/chat/IChatState';
import IJoinedCommunitiesState from '~/screens/Menu/store/Interface';
import ICommunityJoinedGroupTreeState from '~/screens/groups/components/CommunityJoinedGroupTree/store/Interface';
import IDraftPostState from '~/screens/post/DraftPost/store/Interface';
import ILeaveCommunityState from '~/screens/communities/CommunityDetail/store/interface';
import IReactionDetailState from '~/components/reaction/ReactionDetailBottomSheet/store/Interface';
import IRemoveCommunityMemberState from '~/screens/communities/CommunityMembers/store/Interface';

export interface BicStore {
  // screens
  post: {
    PostSelectAudience: {
      selectAudienceStore: ISelectAudienceState
    }
    DraftPost: {
      draftPostStore: IDraftPostState
    },
    ReactionDetail: IReactionDetailState
  },
  communities: {
    leaveCommunity: ILeaveCommunityState;
    removeCommunityMembers: IRemoveCommunityMemberState;
  },
  groups: {
    components: {
      CommunityJoinedGroupTree: {
        communityJoinedGroupTreeStore: ICommunityJoinedGroupTreeState
      }
    }
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
