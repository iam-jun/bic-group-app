import IPostsState from './entities/posts/Interface';
import ICommentsState from '~/store/entities/comments/Interface';
import IHomeState from '~/screens/Home/store/Interface';
import ISelectAudienceState from '~/screens/post/PostSelectAudience/store/Interface';
import IChatState from '~/store/chat/IChatState';
import IJoinedCommunitiesState from '~/screens/Menu/store/Interface';
import ICommunityJoinedGroupTreeState from '~/screens/groups/components/CommunityJoinedGroupTree/store/Interface';
import IDraftPostState from '~/screens/post/DraftPost/store/Interface';
import IReactionDetailState from '~/components/reaction/ReactionDetailBottomSheet/store/Interface';
import ICommunitiesState from './comunities/Interface';
import IUserProfileState from '~/screens/Menu/UserProfile/store/Interface';
import IGroupStructureState from '~/screens/groups/GroupStructureSettings/store/Interface';
import IPermissionSchemeState from '~/screens/PermissionScheme/store/Interface';
import IDiscoverGroupsState from '~/screens/groups/DiscoverGroups/store/Interface';
import IRemoveCommunityMemberState from '~/screens/communities/CommunityMembers/store/Interface';
import IRemoveGroupMemberState from '~/screens/groups/GroupMembers/store/Interface';
import IUserInterestedPostState from '~/screens/post/components/UserInterestedPost/store/Interface';
import { IDiscoverCommunitiesState } from '~/screens/Discover/components/DiscoverCommunities/store/Interface';
import { IManagedState } from '~/screens/Discover/components/Managed/store/Interface';
import { IYourCommunitiesState } from '~/screens/Discover/components/YourCommunities/store/Interface';
import { IYourGroupsState } from '~/screens/Discover/components/YourGroups/store/Interface';

export interface BicStore {
  entities: {
    posts: IPostsState;
    comments: ICommentsState;
  };

  // screens
  post: {
    PostSelectAudience: {
      selectAudienceStore: ISelectAudienceState;
    };
    DraftPost: {
      draftPostStore: IDraftPostState;
    };
    userInterestedPost: IUserInterestedPostState;
    ReactionDetail: IReactionDetailState;
  };
  groups: {
    components: {
      CommunityJoinedGroupTree: {
        communityJoinedGroupTreeStore: ICommunityJoinedGroupTreeState;
      };
      groupStructure: IGroupStructureState;
      discoverGroups: IDiscoverGroupsState;
    };
    removeGroupMemberStore: IRemoveGroupMemberState;
    discoverCommunitiesStore: IDiscoverCommunitiesState;
    managedStore: IManagedState;
    yourCommunitiesStore: IYourCommunitiesState;
    yourGroupsStore: IYourGroupsState;
  };
  Home: {
    homeStore: IHomeState;
  };
  Menu: {
    joinedCommunitiesStore: IJoinedCommunitiesState;
    userProfileStore: IUserProfileState;
  };
  PermissionScheme: {
    permissionSchemeStore: IPermissionSchemeState;
  },

  // others
  chat: IChatState;
  communities: ICommunitiesState;
  removeCommunityMemberStore: IRemoveCommunityMemberState;
}
