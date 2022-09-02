// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import useHomeStore from '~/screens/Home/store/homeStore';
import useJoinedCommunitiesStore from '~/screens/Menu/store/joinedCommunitiesStore';
import useSelectAudienceStore from '~/screens/post/PostSelectAudience/store/selectAudienceStore';
import useChatStore from '~/store/chat';

export const resetStore = () => {
  useHomeStore.getState().reset();
  useJoinedCommunitiesStore.getState().reset();
  useSelectAudienceStore.getStore().reset();
  useChatStore.getStore().reset();
};

export default resetStore;
