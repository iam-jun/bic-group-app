import { ISelectAudienceState } from '~/components/SelectAudience/store';
import { ICreateArticleState } from '~/screens/articles/CreateArticle/store';
import { ICodePushState } from '~/store/codePush';
import IPostsState from './entities/posts/Interface';
import ICommentsState from '~/store/entities/comments/Interface';
import IHomeState from '~/screens/Home/store/Interface';
import IChatState from '~/store/chat/IChatState';
import IJoinedCommunitiesState from '~/screens/Menu/store/Interface';
import ICommunityJoinedGroupTreeState from '~/screens/groups/components/CommunityJoinedGroupTree/store/Interface';
import IDraftPostState from '~/screens/Draft/DraftPost/store/Interface';
import IReactionDetailState from '~/components/reaction/ReactionDetailBottomSheet/store/Interface';
import { IUserProfileState } from '~/screens/Menu/UserProfile/store';
import { IAccountSettingsState } from '~/screens/Menu/AccountSettings/store';
import IGroupStructureState from '~/screens/groups/GroupStructureSettings/store/Interface';
import IPermissionSchemeState from '~/screens/PermissionScheme/store/Interface';
import IDiscoverGroupsState from '~/screens/groups/DiscoverGroups/store/Interface';
import IRemoveCommunityMemberState from '~/screens/communities/CommunityMembers/store/Interface';
import IRemoveGroupMemberState from '~/screens/groups/GroupMembers/store/Interface';
import IUserInterestedPostState from '~/components/posts/UserInterestedPost/store/Interface';
import { IDiscoverCommunitiesState } from '~/screens/Discover/components/DiscoverCommunities/store/Interface';
import { ICommunitiesState } from './entities/communities';
import { IDiscoverCommunitiesSearchState } from '~/screens/Discover/components/SearchDiscoverCommunity/store/Interface';
import { IManagedState } from '~/screens/communities/Communities/components/Managed/store/Interface';
import { IYourCommunitiesState } from '~/screens/communities/Communities/components/YourCommunities/store/Interface';
import { IYourGroupsState } from '~/screens/communities/Communities/components/YourGroups/store/Interface';
import { ISearchJoinedCommunitiesState } from '~/screens/communities/Communities/components/SearchCommunity/store/Interface';
import INotificationsState from '~/screens/Notification/store/Interface';
import { IGiphyState } from './giphy';
import { IDraftArticleState } from '~/screens/Draft/DraftArticle/store';
import { IArticleController } from '~/screens/articles/store';
import { ISeriesState } from '~/screens/series/store';
import { ITopicState } from '~/screens/topic/store';
import { ICreateArticleSeriesState } from '~/screens/articles/CreateArticle/screens/CreateArticleSeries/store';
import { ICreateArticleCategoryState } from '~/screens/articles/CreateArticle/screens/CreateArticleCategory/store';

export interface BicStore {
  entities: {
    posts: IPostsState;
    comments: ICommentsState;
  };
  // components
  SelectAudience: {
    selectAudienceStore: ISelectAudienceState
  };

  // screens
  post: {
    userInterestedPost: IUserInterestedPostState;
    ReactionDetail: IReactionDetailState;
  };
  articles: {
    articleController: IArticleController,
    EditArticle: {
      editArticleStore: ICreateArticleState,
      EditArticleCategory: {
        editArticleCategoryStore: ICreateArticleCategoryState,
        editArticleSeriesStore: ICreateArticleSeriesState,
      }
    }
  };
  series: {
    seriesStore: ISeriesState,
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
    accountSettingsStore: IAccountSettingsState;
  };
  PermissionScheme: {
    permissionSchemeStore: IPermissionSchemeState;
  },

  Notifications: {
    notificationStore: INotificationsState,
  },
  Draft: {
    DraftArticle: {
      draftArticleStore: IDraftArticleState;
    },
    DraftPost: {
      draftPostStore: IDraftPostState;
    };
  }
  topic: {
    topicStore: ITopicState;
  };

  // others
  chat: IChatState;
  communities: ICommunitiesState;
  removeCommunityMemberStore: IRemoveCommunityMemberState;
  giphy: IGiphyState;
  codePush: ICodePushState;
}
