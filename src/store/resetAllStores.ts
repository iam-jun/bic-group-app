import useSelectAudienceStore from '~/components/SelectAudience/store';
import useAuthController from '~/screens/auth/store';
import useCommunityJoinedGroupTreeStore from '~/screens/groups/components/CommunityJoinedGroupTree/store';
import useCommentsStore from '~/store/entities/comments';
import usePostsStore from './entities/posts';
import useMenuStore from './entities/menus';
import useHomeStore from '~/screens/Home/store';
import useMenuController from '~/screens/Menu/store';
import useChatStore from '~/store/chat';
import useDraftPostStore from '../screens/YourContent/components/Draft/DraftPost/store';
import useReactionDetailStore from '~/components/reaction/ReactionDetailBottomSheet/store';
import useCommunitiesStore from './entities/communities';
import useUserProfileStore from '~/screens/Menu/UserProfile/store';
import useDiscoverGroupsStore from '~/screens/groups/DiscoverGroups/store';
import useCommunityMemberStore from '~/screens/communities/CommunityMembers/store';
import useGroupMemberStore from '~/screens/groups/GroupMembers/store';
import useCreateArticleStore from '~/screens/articles/CreateArticle/store';
import useArticlesStore from '../screens/articles/ArticleDetail/store';
import useUserInterestedPostStore from '~/components/posts/UserInterestedPost/store';
import useDiscoverCommunitiesStore from '~/screens/Discover/components/DiscoverCommunities/store';
import useTimelineStore from './timeline';
import useDiscoverCommunitiesSearchStore from '~/screens/Discover/components/SearchDiscoverCommunity/store';
import useManagedStore from '~/screens/communities/Communities/components/Managed/store';
import useYourCommunitiesStore from '~/screens/communities/Communities/components/YourCommunities/store';
import useYourGroupsStore from '~/screens/communities/Communities/components/YourGroups/store';
import useSearchJoinedCommunitiesStore from '~/screens/communities/Communities/components/SearchCommunity/store';
import useNotificationStore from '~/screens/Notification/store';
import useGiphyStore from './giphy';
import useDraftArticleStore from '~/screens/YourContent/components/Draft/DraftArticle/store';
import useArticleController from '~/screens/articles/store';
import useSeriesStore from '~/screens/series/store';
import useTopicStore from '~/screens/topic/store';
import useAddArticlesStore from '~/screens/series/SeriesDetail/components/AddArticles/store';
import useForgotPasswordStore from '~/screens/auth/ForgotPassword/store';
import useChangePasswordStore from '~/screens/Menu/AccountSettings/SecurityLogin/ChangePassword/store';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import useMyPermissionsStore from './permissions';
import useTagsStore from './entities/tags';
import useTagsControllerStore from '~/screens/tags/store';
import useGeneralInformationStore from '~/screens/groups/GeneralInformation/store';
import useRemoteConfigStore from './remoteConfig';
import usePostsInProgressStore from '~/screens/Home/components/VideoProcessingNotice/store';
import useCommentInputStore from '~/screens/comments/components/CommentInputView/store';
import useReportContentStore from '~/components/Report/store';
import useNetworkStore from '~/store/network';
import useModalStore from '~/store/modal';
import useArticleScheduleContentStore from '~/screens/articles/ArticleScheduleContent/store';
import useButtonMarkAsReadStore from '~/components/posts/ButtonMarkAsRead/store';
import useCreatePostStore from '~/screens/post/CreatePost/store';
import useLinkPreviewStore from './linkPreview';
import useSeriesContentModalStore from '~/components/series/SeriesContentModal/store';
import useAppStore from './app';
import useSelectSeriesStore from '~/components/SelectSeries/store';
import useSelectTagsStore from '~/components/SelectTags/store';
import useValidateSeriesTagsStore from '~/components/ValidateSeriesTags/store';
import useCommonController from '~/screens/store';
import useBlockingStore from './blocking';
import useYourContentStore from '~/screens/YourContent/store';
import useMaintenanceStore from './maintenance';
import usePinContentStore from '~/components/PinContent/store';
import useTermStore from '~/components/TermsModal/store';
import useDraftContentsStore from '~/screens/YourContent/components/Draft/DraftContents/store';
import usePublishStore from '~/screens/YourContent/components/Publish/store';
import useUserBadge from '~/screens/Menu/UserProfile/fragments/BadgeCollection/store';
import useYourQuizStore from '~/screens/quiz/YourQuiz/store';
import useTakeQuizStore from '~/screens/quiz/TakeQuiz/store';
import usePersonalPrivacy from '~/screens/Menu/AccountSettings/PrivacyCenter/store';
import useMembershipPolicySettingsStore from '~/screens/groups/MembershipPolicySettings/store';
import usePreviewJoinableGroupStore from '~/components/PreviewJoinableGroup/store';
import useNotiSettingsStore from '~/screens/Notification/NotiSettings/store';
import useGroupJoinableUsersStore from '~/components/InvitePeopleToYourGroup/store';
import useNotiInvitationsStore from '~/screens/Notification/components/NotificationItem/store';
import useMyInvitationsStore from '~/screens/Menu/UserProfile/fragments/InvitationList/store';
import useAdvancedNotiSettingsStore from '~/screens/Notification/AdvancedSettings/store';
import useSelectCategoriesStore from '~/components/SelectCategories/store';
import useQuizzesStore from './entities/quizzes';
import useSearchStore from '~/screens/Search/store';
import useSearchFilterUsersStore from '~/screens/Search/SearchFilter/SearchFilterUsers/store';
import useSearchFilterTagsStore from '~/screens/Search/SearchFilter/SearchFilterTags/store';
import useGroupSetInvitationsStore from '~/components/InvitationGroupSet/store';
import useNotificationItemMenu from '~/screens/Notification/components/NotificationMenu/store';
import useScheduledContentsStore from '~/screens/YourContent/components/Scheduled/store';

export const excludedStore = [
  useAuthController,
  useModalStore,
  useNetworkStore,

  // components
  useButtonMarkAsReadStore,
];

const stores = [
  // entities
  usePostsStore,
  useCommentsStore,
  useMenuStore,

  // components
  useReportContentStore,
  useGroupJoinableUsersStore,

  // screens
  useHomeStore,
  useMenuController,
  useSelectAudienceStore,
  useDraftPostStore,
  useChatStore,
  useCommunitiesStore,
  useCommunityJoinedGroupTreeStore,
  useReactionDetailStore,
  useUserProfileStore,
  useNotificationStore,
  useDraftArticleStore,
  useArticleController,
  useTopicStore,
  useScheduledContentsStore,
  useYourContentStore,
  useArticleScheduleContentStore,
  useCreatePostStore,
  useGroupJoinableUsersStore,
  useYourQuizStore,
  useTakeQuizStore,

  // others
  useChatStore,
  useDiscoverGroupsStore,
  useCommunityMemberStore,
  useGroupMemberStore,
  useCreateArticleStore,
  useSelectCategoriesStore,
  useSelectSeriesStore,
  useArticlesStore,
  useUserInterestedPostStore,
  useDiscoverCommunitiesStore,
  useDiscoverCommunitiesSearchStore,
  useManagedStore,
  useYourCommunitiesStore,
  useYourGroupsStore,
  useTimelineStore,
  useSearchJoinedCommunitiesStore,
  useGiphyStore,
  useSeriesStore,
  useAddArticlesStore,
  useForgotPasswordStore,
  useChangePasswordStore,
  useGroupDetailStore,
  useMyPermissionsStore,
  useTagsStore,
  useTagsControllerStore,
  useGeneralInformationStore,
  useRemoteConfigStore,
  usePostsInProgressStore,
  useCommentInputStore,
  useLinkPreviewStore,
  useSeriesContentModalStore,
  useAppStore,
  useSelectTagsStore,
  useValidateSeriesTagsStore,
  useCommonController,
  useBlockingStore,
  useMaintenanceStore,
  usePinContentStore,
  useTermStore,
  useDraftContentsStore,
  usePublishStore,
  useUserBadge,
  usePersonalPrivacy,
  useMembershipPolicySettingsStore,
  usePreviewJoinableGroupStore,
  useNotiSettingsStore,
  useNotiInvitationsStore,
  useMyInvitationsStore,
  useAdvancedNotiSettingsStore,
  useQuizzesStore,
  useSearchStore,
  useSearchFilterUsersStore,
  useSearchFilterTagsStore,
  useGroupSetInvitationsStore,
  useNotificationItemMenu,
];

export const resetAllStores = () => {
  try {
    stores.forEach((store: any) => {
      const functionReset = store?.getState?.().reset;
      if (functionReset) {
        functionReset();
      } else {
        console.error(
          '\x1b[35m🐣️ resetAllStores a store error ',
          store?.name,
          '\x1b[0m',
        );
      }
    });
  } catch (e) {
    console.error(
      '\x1b[35m🐣️ resetAllStores resetAllStores Error',
      e,
      '\x1b[0m',
    );
  }
};

export default resetAllStores;
