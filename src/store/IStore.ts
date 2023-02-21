import { ISelectAudienceState } from '~/components/SelectAudience/store';
import { ICreateArticleState } from '~/screens/articles/CreateArticle/store';
import { ICodePushState } from '~/store/codePush';
import { INetworkState } from '~/store/network';
import { IPostsState } from './entities/posts';
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
import { ICommunityMemberState } from '~/screens/communities/CommunityMembers/store';
import { IGroupMemberState } from '~/screens/groups/GroupMembers/store';
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
import { IGroupDetailState } from '~/screens/groups/GroupDetail/store';
import { IMyPermissionsState } from './permissions';
import { ITagsState } from './entities/tags';
import { IGeneralInformationState } from '~/screens/groups/GeneralInformation/store';
import { IRemoteConfigState } from './remoteConfig';
import { IReportContentState } from '~/components/Report/store';
import { IGroupsState } from './entities/groups';
import { IModalState } from './modal';
import { IScheduleArticlesState } from '~/screens/YourContent/components/ScheduledArticles/store';
import { IPostsInProgressState } from '~/screens/Home/components/VideoProcessingNotice/store';
import { IArticleScheduleContentState } from '~/screens/articles/ArticleScheduleContent/store';
import { IFeedSearchState } from '~/screens/Home/HomeSearch/store';
import { IButtonMarkAsReadState } from '~/components/posts/ButtonMarkAsRead/store';
import { ICreatePostState } from '~/screens/post/CreatePost/store';
import { ILinkPreviewState } from './linkPreview';

export interface BicStore {
  entities: {
    posts: IPostsState;
    comments: ICommentsState;
    communities: ICommunitiesState;
    groups: IGroupsState;
  };

  // components
  SelectAudience: {
    selectAudienceStore: ISelectAudienceState;
  };
  Report: {
    reportContentStore: IReportContentState;
  };
  posts: {
    ButtonMarkAsRead: {
      buttonMarkAsReadStore: IButtonMarkAsReadState;
    }
  }

  // screens
  post: {
    userInterestedPost: IUserInterestedPostState;
    ReactionDetail: IReactionDetailState;
    CreatePost: {
      createPostStore: ICreatePostState;
    }
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
    ArticleScheduleContent: {
      articleScheduleContentStore: IArticleScheduleContentState;
    }
  };
  series: {
    seriesStore: ISeriesState,
  };
  groups: {
    GeneralInformation: {
      generalInformationStore: IGeneralInformationState;
    };
    components: {
      CommunityJoinedGroupTree: {
        communityJoinedGroupTreeStore: ICommunityJoinedGroupTreeState;
      };
      groupStructure: IGroupStructureState;
      discoverGroups: IDiscoverGroupsState;
    };
    GroupMembers: {
      groupMemberStore: IGroupMemberState;
    };
    GroupDetail: {
      groupDetailStore: IGroupDetailState;
    };
    managedStore: IManagedState;
    yourCommunitiesStore: IYourCommunitiesState;
    yourGroupsStore: IYourGroupsState;
    searchJoinedCommunitiesStore: ISearchJoinedCommunitiesState;
  };
  Discover: {
    components: {
      DiscoverCommunities: {
        discoverCommunitiesStore: IDiscoverCommunitiesState
      }
      SearchDiscoverCommunity: {
        discoverCommunitiesSearchStore: IDiscoverCommunitiesSearchState;
      }
    }
  };
  communities: {
    communityMember: {
      communityMemberStore: ICommunityMemberState,
    },
  }
  Home: {
    homeStore: IHomeState;
    feedSearch: IFeedSearchState;
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
  YourContent: {
    scheduleArticleStore: IScheduleArticlesState;
  },

  // others
  chat: IChatState;
  giphy: IGiphyState;
  codePush: ICodePushState;
  myPermissions: IMyPermissionsState;
  network: INetworkState;
  tags: ITagsState;
  remoteConfig: IRemoteConfigState;
  modal: IModalState;
  postsContainingVideoInProgress: IPostsInProgressState;
  linkPreview: ILinkPreviewState
}
