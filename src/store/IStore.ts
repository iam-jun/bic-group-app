import { ISelectAudienceState } from '~/components/SelectAudience/store';
import { ICreateArticleState } from '~/screens/articles/CreateArticle/store';
import { INetworkState } from '~/store/network';
import { IPostsState } from './entities/posts';
import ICommentsState from '~/store/entities/comments/Interface';
import IHomeState from '~/screens/Home/store/Interface';
import IChatState from '~/store/chat/IChatState';
import IJoinedCommunitiesState from '~/screens/Menu/store/Interface';
import ICommunityJoinedGroupTreeState from '~/screens/groups/components/CommunityJoinedGroupTree/store/Interface';
import IDraftPostState from '~/screens/YourContent/components/Draft/DraftPost/store/Interface';
import IReactionDetailState from '~/components/reaction/ReactionDetailBottomSheet/store/Interface';
import { IUserProfileState } from '~/screens/Menu/UserProfile/store';
import IDiscoverGroupsState from '~/screens/groups/DiscoverGroups/store/Interface';
import { ICommunityMemberState } from '~/screens/communities/CommunityMembers/store';
import { IGroupMemberState } from '~/screens/groups/GroupMembers/store';
import IUserInterestedPostState from '~/components/posts/UserInterestedPost/store/Interface';
import { ICommunitiesState } from './entities/communities';
import { IDiscoverCommunitiesSearchState } from '~/screens/Discover/components/SearchDiscoverCommunity/store';
import { IManagedState } from '~/screens/communities/Communities/components/Managed/store/Interface';
import { IYourCommunitiesState } from '~/screens/communities/Communities/components/YourCommunities/store/Interface';
import { IYourGroupsState } from '~/screens/communities/Communities/components/YourGroups/store/Interface';
import { ISearchJoinedCommunitiesState } from '~/screens/communities/Communities/components/SearchCommunity/store/Interface';
import INotificationsState from '~/screens/Notification/store/Interface';
import { IGiphyState } from './giphy';
import { IDraftArticleState } from '~/screens/YourContent/components/Draft/DraftArticle/store';
import { IArticleController } from '~/screens/articles/store';
import { ISeriesState } from '~/screens/series/store';
import { ITopicState } from '~/screens/topic/store';
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
import { ISeriesContentModalState } from '~/components/series/SeriesContentModal/store';
import { ISelectSeriesState } from '~/components/SelectSeries/store';
import { ISelectTagsState } from '~/components/SelectTags/store';
import { IValidateSeriesTags } from '~/components/ValidateSeriesTags/store';
import { IDiscoverCommunitiesState } from '~/screens/Discover/components/DiscoverCommunities/store';
import { IBlockingState } from './blocking';
import { IYourContentState } from '~/screens/YourContent/store';
import { IMaintenanceState } from './maintenance';
import { IPinContentState } from '~/components/PinContent/store';
import { ITermState } from '~/components/TermsModal/store';
import { IDraftContentsState } from '~/screens/YourContent/components/Draft/DraftContents/store';
import { IPublishState } from '~/screens/YourContent/components/Publish/store';
import { IUserBadgesState } from '~/screens/Menu/UserProfile/fragments/BadgeCollection/store';
import { IYourQuizState } from '~/screens/quiz/YourQuiz/store';
import { ITakeQuizState } from '~/screens/quiz/TakeQuiz/store';
import { IPersonalInfoVisibilityState } from '~/screens/Menu/AccountSettings/PrivacyCenter/store';
import { IMembershipPolicySettingsState } from '~/screens/groups/MembershipPolicySettings/store';
import { IPreviewJoinableGroupState } from '~/components/PreviewJoinableGroup/store';
import { INotiSettingsStore } from '~/screens/Notification/NotiSettings/store';
import { IGroupJoinableUsersState } from '~/components/InvitePeopleToYourGroup/store';
import { INotiInvitationsStore } from '~/screens/Notification/components/NotificationItem/store';
import { IAdvancedNotiSettingsStore } from '~/screens/Notification/AdvancedSettings/store';
import { IQuizzesState } from './entities/quizzes';
import { ISearchState } from '~/screens/Search/store';
import { ISearchFilterUsersState } from '~/screens/Search/SearchFilter/SearchFilterUsers/store';
import { ISearchFilterTagsState } from '~/screens/Search/SearchFilter/SearchFilterTags/store';
import { IGroupSetInvitationsStore } from '~/components/InvitationGroupSet/store';
import { INotificationItemMenuStore } from '~/screens/Notification/components/NotificationMenu/store';
import { ISelectCategoriesState } from '~/components/SelectCategories/store';

export interface BicStore {
  entities: {
    posts: IPostsState;
    comments: ICommentsState;
    communities: ICommunitiesState;
    groups: IGroupsState;
    quiz: IQuizzesState;
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
    };
  };
  InvitePeopleToYourGroup: {
    groupJoinableUsersStore: IGroupJoinableUsersState;
  }

  // screens
  post: {
    userInterestedPost: IUserInterestedPostState;
    ReactionDetail: IReactionDetailState;
    CreatePost: {
      createPostStore: ICreatePostState;
    };
  };
  articles: {
    articleController: IArticleController;
    EditArticle: {
      editArticleStore: ICreateArticleState;
    };
    ArticleScheduleContent: {
      articleScheduleContentStore: IArticleScheduleContentState;
    };
  };
  series: {
    seriesStore: ISeriesState;
    seriesContentModal: ISeriesContentModalState;
  };
  groups: {
    GeneralInformation: {
      generalInformationStore: IGeneralInformationState;
    };
    components: {
      CommunityJoinedGroupTree: {
        communityJoinedGroupTreeStore: ICommunityJoinedGroupTreeState;
      };
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
    MembershipPolicySettings: {
      membershipPolicySettingsStore: IMembershipPolicySettingsState
    }
  };
  Discover: {
    components: {
      DiscoverCommunities: {
        discoverCommunitiesStore: IDiscoverCommunitiesState;
      };
      SearchDiscoverCommunity: {
        discoverCommunitiesSearchStore: IDiscoverCommunitiesSearchState;
      };
    };
  };
  communities: {
    communityMember: {
      communityMemberStore: ICommunityMemberState;
    };
  };
  terms: ITermState;
  Home: {
    homeStore: IHomeState;
    feedSearch: IFeedSearchState;
  };
  Menu: {
    joinedCommunitiesStore: IJoinedCommunitiesState;
    userProfileStore: IUserProfileState;
    AccountSettings: {
      Blocking: {
        blockingStore: IBlockingState;
      };
      PersonalInformationVisibility: {
        personalInfoVisibilityStore: IPersonalInfoVisibilityState;
      };
    };
    userBadge: IUserBadgesState;
  };

  Notifications: {
    notificationStore: INotificationsState;
    INotiSettingsStore: INotiSettingsStore;
    INotiInvitationsStore: INotiInvitationsStore;
    IAdvancedNotiSettingsStore: IAdvancedNotiSettingsStore;
    INotificationItemMenu: INotificationItemMenuStore;
  };
  Draft: {
    DraftArticle: {
      draftArticleStore: IDraftArticleState;
    };
    DraftPost: {
      draftPostStore: IDraftPostState;
    };
     DraftContents: {
      draftContentsStore: IDraftContentsState;
    };
  };
  topic: {
    topicStore: ITopicState;
  };
  YourContent: {
    yourContentStore: IYourContentState;
    scheduleArticleStore: IScheduleArticlesState;
    publishStore: IPublishState;
  };
  YourQuiz: {
    yourQuizStore: IYourQuizState;
  },
  TakeQuiz: {
    takeQuizStore: ITakeQuizState;
  },

  // others
  chat: IChatState;
  giphy: IGiphyState;
  myPermissions: IMyPermissionsState;
  network: INetworkState;
  tags: ITagsState;
  remoteConfig: IRemoteConfigState;
  modal: IModalState;
  postsContainingVideoInProgress: IPostsInProgressState;
  linkPreview: ILinkPreviewState;
  selectTags: ISelectTagsState;
  selectSeries: ISelectSeriesState;
  selectCategories: ISelectCategoriesState;
  validateSeriesTags: IValidateSeriesTags;
  blockingStore: IBlockingState;
  maintenanceStore: IMaintenanceState;
  pinContent: IPinContentState;
  previewJoinableGroupStore: IPreviewJoinableGroupState;
  search: ISearchState;
  searchFilterUsers: ISearchFilterUsersState;
  searchFilterTags: ISearchFilterTagsState;
  IGroupSetInvitationsStore: IGroupSetInvitationsStore;
}
