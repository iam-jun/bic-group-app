import useSelectAudienceStore from '~/components/SelectAudience/store';
import useAuthController from '~/screens/auth/store';
import useCommunityJoinedGroupTreeStore from '~/screens/groups/components/CommunityJoinedGroupTree/store';
import useCodePushStore from '~/store/codePush';
import useCommentsStore from '~/store/entities/comments';
import usePostsStore from './entities/posts';
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
import useCreateArticleCategoryStore from '~/screens/articles/CreateArticle/screens/CreateArticleCategory/store';
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
import useScheduleArticlesStore from '~/screens/YourContent/components/ScheduledArticles/store';
import useReportContentStore from '~/components/Report/store';
import useNetworkStore from '~/store/network';
import useModalStore from '~/store/modal';
import useArticleScheduleContentStore from '~/screens/articles/ArticleScheduleContent/store';
import useFeedSearchStore from '~/screens/Home/HomeSearch/store';
import useButtonMarkAsReadStore from '~/components/posts/ButtonMarkAsRead/store';
import useCreatePostStore from '~/screens/post/CreatePost/store';
import useLinkPreviewStore from './linkPreview';
import useSeriesContentModalStore from '~/components/series/SeriesContentModal/store';
import useAppStore from './app';
import useGroupJoinableUsersStore from '~/screens/groups/GroupMembers/AddMembersToGroup/store';
import useSelectSeriesStore from '~/components/SelectSeries/store';
import useSelectTagsStore from '~/components/SelectTags/store';
import useValidateSeriesTagsStore from '~/components/ValidateSeriesTags/store';
import useCommonController from '~/screens/store';
import useBlockingStore from './blocking';
import useYourContentStore from '~/screens/YourContent/store';

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

  // components
  useReportContentStore,

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
  useScheduleArticlesStore,
  useYourContentStore,
  useArticleScheduleContentStore,
  useCreatePostStore,
  useGroupJoinableUsersStore,

  // others
  useChatStore,
  useDiscoverGroupsStore,
  useCommunityMemberStore,
  useGroupMemberStore,
  useCreateArticleStore,
  useCreateArticleCategoryStore,
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
  useCodePushStore,
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
  useFeedSearchStore,
  useLinkPreviewStore,
  useSeriesContentModalStore,
  useAppStore,
  useSelectTagsStore,
  useValidateSeriesTagsStore,
  useCommonController,
  useBlockingStore,
];

export const resetAllStores = () => {
  try {
    stores.forEach((store: any) => {
      const functionReset = store?.getState?.().reset;
      if (functionReset) {
        functionReset();
      } else {
        console.error('\x1b[35m🐣️ resetAllStores a store error ', store?.name, '\x1b[0m');
      }
    });
  } catch (e) {
    console.error('\x1b[35m🐣️ resetAllStores resetAllStores Error', e, '\x1b[0m');
  }
};

export default resetAllStores;
