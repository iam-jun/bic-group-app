import useSelectAudienceStore from '~/components/SelectAudience/store';
import useCommunityJoinedGroupTreeStore from '~/screens/groups/components/CommunityJoinedGroupTree/store';
import useCodePushStore from '~/store/codePush';
import useCommentsStore from '~/store/entities/comments';
import usePostsStore from './entities/posts';
import useHomeStore from '~/screens/Home/store';
import useMenuController from '~/screens/Menu/store';
import useChatStore from '~/store/chat';
import useDraftPostStore from '../screens/Draft/DraftPost/store';
import useGroupStructureStore from '~/screens/groups/GroupStructureSettings/store';
import useReactionDetailStore from '~/components/reaction/ReactionDetailBottomSheet/store';
import useCommunitiesStore from './entities/communities';
import useUserProfileStore from '~/screens/Menu/UserProfile/store';
import useAccountSettingsStore from '~/screens/Menu/AccountSettings/store';
import usePermissionSchemeStore from '~/screens/PermissionScheme/store';
import useDiscoverGroupsStore from '~/screens/groups/DiscoverGroups/store';
import useRemoveCommunityMemberStore from '~/screens/communities/CommunityMembers/store';
import useRemoveGroupMemberStore from '~/screens/groups/GroupMembers/store';
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
import useDraftArticleStore from '~/screens/Draft/DraftArticle/store';
import useArticleController from '~/screens/articles/store';
import useSeriesStore from '~/screens/series/store';
import useTopicStore from '~/screens/topic/store';
import useAddArticlesStore from '~/screens/series/SeriesDetail/components/AddArticles/store';
import useCreateArticleCategoryStore from '~/screens/articles/CreateArticle/screens/CreateArticleCategory/store';
import useCreateArticleSeriesStore from '~/screens/articles/CreateArticle/screens/CreateArticleSeries/store';
import useForgotPasswordStore from '~/screens/auth/ForgotPassword/store';
import useChangePasswordStore from '~/screens/Menu/AccountSettings/SecurityLogin/ChangePassword/store';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';

const stores = [
  // entities
  usePostsStore,
  useCommentsStore,

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
  useAccountSettingsStore,
  useGroupStructureStore,
  usePermissionSchemeStore,
  useNotificationStore,
  useDraftArticleStore,
  useArticleController,
  useTopicStore,

  // others
  useChatStore,
  useDiscoverGroupsStore,
  useRemoveCommunityMemberStore,
  useRemoveGroupMemberStore,
  useCreateArticleStore,
  useCreateArticleCategoryStore,
  useCreateArticleSeriesStore,
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
];

export const resetAllStores = () => {
  try {
    stores.forEach((store: any) => store.getState().reset?.());
  } catch (e) {
    console.error('\x1b[35m🐣️ resetAllStores resetAllStores Error', e, '\x1b[0m');
  }
};

export default resetAllStores;
