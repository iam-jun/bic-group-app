// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import useHomeStore from '~/screens/Home/store/homeStore';
import useJoinedCommunitiesStore from '~/screens/Menu/store/joinedCommunities';

export const resetStore = () => {
  useHomeStore.getState().reset();
  useJoinedCommunitiesStore.getState().reset();
};

export default resetStore;
