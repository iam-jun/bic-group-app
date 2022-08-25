// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import useHomeStore from '~/screens/Home/store/homeStore';
import useJoinedCommunitiesStore from '~/screens/Menu/store/joinedCommunities';
import { useSelectAudienceStore } from '~/screens/post/PostSelectAudience/store/selectAudienceStore';

export const resetStore = () => {
  useHomeStore.getState().reset();
  useJoinedCommunitiesStore.getState().reset();
  useSelectAudienceStore.getStore().reset();
};

export default resetStore;
