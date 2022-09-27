// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import useCommunityJoinedGroupTreeStore from '~/screens/groups/components/CommunityJoinedGroupTree/store';
import useHomeStore from '~/screens/Home/store';
import useJoinedCommunitiesStore from '~/screens/Menu/store';
import useSelectAudienceStore from '~/screens/post/PostSelectAudience/store';
import useChatStore from '~/store/chat';
import useDraftPostStore from '~/screens/post/DraftPost/store';
import useLeaveCommunity from '~/screens/communities/CommunityDetail/store';
import useReactionDetailStore from '~/components/reaction/ReactionDetailBottomSheet/store';
import useDiscoverGroupsStore from '~/screens/groups/DiscoverGroups/store';
import useRemoveCommunityMemberStore from '~/screens/communities/CommunityMembers/store';
import useRemoveGroupMemberStore from '~/screens/groups/GroupMembers/store';

const stores = [
  useHomeStore,
  useJoinedCommunitiesStore,
  useSelectAudienceStore,
  useDraftPostStore,
  useChatStore,
  useLeaveCommunity,
  useCommunityJoinedGroupTreeStore,
  useReactionDetailStore,
  useDiscoverGroupsStore,
  useRemoveCommunityMemberStore,
  useRemoveGroupMemberStore,
];

export const resetAllStores = () => {
  stores.forEach((store: any) => store.getState().reset());
};

export default resetAllStores;
