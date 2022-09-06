// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import useHomeStore from '~/screens/Home/store';
import useJoinedCommunitiesStore from '~/screens/Menu/store';
import useSelectAudienceStore from '~/screens/post/PostSelectAudience/store';
import useChatStore from '~/store/chat';
import useDraftPostStore from '../screens/post/DraftPost/store';

const stores = [
  useHomeStore,
  useJoinedCommunitiesStore,
  useSelectAudienceStore,
  useDraftPostStore,
  useChatStore,
];

export const resetAllStores = () => {
  stores.forEach((store: any) => store.getState().reset());
};

export default resetAllStores;
