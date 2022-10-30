import { IEditArticleCategoryState } from '~/screens/articles/EditArticle/EditCategory/store';
import { IEditArticleState } from '~/screens/articles/EditArticle/store';
import IPostsState from './entities/posts/Interface';
import ICommentsState from '~/store/entities/comments/Interface';
import IHomeState from '~/screens/Home/store/Interface';
import ISelectAudienceState from '~/screens/post/PostSelectAudience/store/Interface';
import IChatState from '~/store/chat/IChatState';
import IJoinedCommunitiesState from '~/screens/Menu/store/Interface';
import ICommunityJoinedGroupTreeState from '~/screens/groups/components/CommunityJoinedGroupTree/store/Interface';
import IDraftPostState from '~/screens/post/DraftPost/store/Interface';
import IReactionDetailState from '~/components/reaction/ReactionDetailBottomSheet/store/Interface';
import IUserProfileState from '~/screens/Menu/UserProfile/store/Interface';
import IGroupStructureState from '~/screens/groups/GroupStructureSettings/store/Interface';
import IPermissionSchemeState from '~/screens/PermissionScheme/store/Interface';
import IDiscoverGroupsState from '~/screens/groups/DiscoverGroups/store/Interface';
import IRemoveCommunityMemberState from '~/screens/communities/CommunityMembers/store/Interface';
import IRemoveGroupMemberState from '~/screens/groups/GroupMembers/store/Interface';
import IUserInterestedPostState from '~/screens/post/components/UserInterestedPost/store/Interface';
import { IDiscoverCommunitiesState } from '~/screens/Discover/components/DiscoverCommunities/store/Interface';
import { ICommunitiesState } from './entities/communities';
import { IDiscoverCommunitiesSearchState } from '~/screens/Discover/components/SearchDiscoverCommunity/store/Interface';
import { IManagedState } from '~/screens/communities/Communities/components/Managed/store/Interface';
import { IYourCommunitiesState } from '~/screens/communities/Communities/components/YourCommunities/store/Interface';
import { IYourGroupsState } from '~/screens/communities/Communities/components/YourGroups/store/Interface';
import { ISearchJoinedCommunitiesState } from '~/screens/communities/Communities/components/SearchCommunity/store/Interface';
import { IGiphyState } from './giphy';

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
  articles: {
    EditArticle: {
      editArticleStore: IEditArticleState,
      EditArticleCategory: {
        editArticleCategoryStore: IEditArticleCategoryState
      }
    }
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
    discoverCommunitiesSearchStore: IDiscoverCommunitiesSearchState;
    managedStore: IManagedState;
    yourCommunitiesStore: IYourCommunitiesState;
    yourGroupsStore: IYourGroupsState;
    searchJoinedCommunitiesStore: ISearchJoinedCommunitiesState;
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
  giphy: IGiphyState;
}
