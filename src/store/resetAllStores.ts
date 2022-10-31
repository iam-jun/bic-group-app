import useCommunityJoinedGroupTreeStore from '~/screens/groups/components/CommunityJoinedGroupTree/store';
import useCommentsStore from '~/store/entities/comments';
import usePostsStore from './entities/posts';
import useHomeStore from '~/screens/Home/store';
import useMenuController from '~/screens/Menu/store';
import useSelectAudienceStore from '~/screens/post/PostSelectAudience/store';
import useChatStore from '~/store/chat';
import useDraftPostStore from '../screens/post/DraftPost/store';
import useGroupStructureStore from '~/screens/groups/GroupStructureSettings/store';
import useReactionDetailStore from '~/components/reaction/ReactionDetailBottomSheet/store';
import useCommunitiesStore from './entities/communities';
import useUserProfileStore from '~/screens/Menu/UserProfile/store';
import usePermissionSchemeStore from '~/screens/PermissionScheme/store';
import useDiscoverGroupsStore from '~/screens/groups/DiscoverGroups/store';
import useRemoveCommunityMemberStore from '~/screens/communities/CommunityMembers/store';
import useRemoveGroupMemberStore from '~/screens/groups/GroupMembers/store';
import useEditArticleCategoryStore from '~/screens/articles/EditArticle/EditCategory/store';
import useEditArticleStore from '~/screens/articles/EditArticle/store';
import useArticlesStore from '../screens/articles/ArticleDetail/store';
import useArticleListStore from '~/screens/articles/ArticleList/store';
import useUserInterestedPostStore from '~/screens/post/components/UserInterestedPost/store';
import useDiscoverCommunitiesStore from '~/screens/Discover/components/DiscoverCommunities/store';
import useTimelineStore from './timeline';
import useDiscoverCommunitiesSearchStore from '~/screens/Discover/components/SearchDiscoverCommunity/store';
import useManagedStore from '~/screens/communities/Communities/components/Managed/store';
import useYourCommunitiesStore from '~/screens/communities/Communities/components/YourCommunities/store';
import useYourGroupsStore from '~/screens/communities/Communities/components/YourGroups/store';
import useSearchJoinedCommunitiesStore from '~/screens/communities/Communities/components/SearchCommunity/store';
import useGiphyStore from './giphy';

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
  useGroupStructureStore,
  usePermissionSchemeStore,

  // others
  useChatStore,
  useDiscoverGroupsStore,
  useRemoveCommunityMemberStore,
  useRemoveGroupMemberStore,
  useEditArticleStore,
  useEditArticleCategoryStore,
  useArticlesStore,
  useArticleListStore,
  useUserInterestedPostStore,
  useDiscoverCommunitiesStore,
  useDiscoverCommunitiesSearchStore,
  useManagedStore,
  useYourCommunitiesStore,
  useYourGroupsStore,
  useTimelineStore,
  useSearchJoinedCommunitiesStore,
  useGiphyStore,
];

export const resetAllStores = () => {
  try {
    stores.forEach((store: any) => store.getState().reset?.());
  } catch (e) {
    console.error('\x1b[35m🐣️ resetAllStores resetAllStores Error', e, '\x1b[0m');
  }
};

export default resetAllStores;
