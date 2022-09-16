import { createStore } from '~/store/utils';
import leaveCommunity from './actions/leaveCommunity';
import ILeaveCommunityState from './interface';

const leaveCommunityStore = (set, get) => ({
  doPostLeaveCommunity: leaveCommunity(set, get),
});

const useLeaveCommunity = createStore<ILeaveCommunityState>(leaveCommunityStore);

export default useLeaveCommunity;
