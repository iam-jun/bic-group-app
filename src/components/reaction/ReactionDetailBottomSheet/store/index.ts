import { createStore, resetStore } from '~/store/utils';
import IReactionDetailState from './Interface';
import { InitStateType } from '~/store/interfaces/IBaseState';
import getReactionDetail from './actions/getReactionDetail';
import loadMoreReactionDetail from './actions/loadMoreReactionDetail';

const initState: InitStateType<IReactionDetailState> = {
  data: [],
  loading: false,
  canLoadMore: true,
  isLoadingMore: false,
};

const useReactionDetail = (set, get) => ({
  ...initState,
  actions: {
    getReactionDetail: getReactionDetail(set, get),
    loadMoreReactionDetail: loadMoreReactionDetail(set, get),
  },
  reset: () => resetStore(initState, set),
});

const useReactionDetailStore = createStore<IReactionDetailState>(
  useReactionDetail,
);

export default useReactionDetailStore;
