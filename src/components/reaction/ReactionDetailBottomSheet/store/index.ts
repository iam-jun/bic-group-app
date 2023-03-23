import streamApi from '~/api/StreamApi';
import { IParamGetReactionDetail } from '~/interfaces/IPost';
import { createStore, resetStore } from '~/store/utils';
import IReactionDetailState from './Interface';

const initState: IReactionDetailState = {
  data: [],
  loading: false,
  canLoadMore: true,
  isLoadingMore: false,
};

const useReactionDetail = (set, get) => ({
  ...initState,
  doGetReactionDetail: (params: IParamGetReactionDetail) => {
    set((state) => { state.loading = true; }, 'getReactionDetail');
    streamApi.getReactionDetail(params)
      .then((response) => {
        const users = (response?.list || []).map((item: any) => ({
          id: item?.actor?.id,
          avatar: item?.actor?.avatar,
          fullname: item?.actor?.fullname,
          username: item?.actor?.username,
          isDeactivated: item?.actor?.isDeactivated,
          reactionId: item?.id,
        }));
        set((state) => {
          state.loading = false;
          state.data = users || [];
          state.canLoadMore = users.length === params.limit;
        }, 'getReactionDetailSuccess');
      })
      .catch((error) => {
        console.warn('\x1b[35m🐣️ getReactionDetail error ', error, '\x1b[0m');
        set((state) => {
          state.loading = false;
        }, 'getReactionDetailError');
      });
  },
  doLoadMoreReactionDetail: (params: IParamGetReactionDetail) => {
    set((state) => { state.isLoadingMore = true; }, 'loadMoreReactionDetail');

    streamApi.getReactionDetail(params)
      .then((response) => {
        const users = (response?.list || []).map((item: any) => ({
          id: item?.actor?.id,
          avatar: item?.actor?.avatar,
          fullname: item?.actor?.fullname,
          username: item?.actor?.username,
          isDeactivated: item?.actor?.isDeactivated,
          reactionId: item?.id,
        }));
        const oldData = get()?.data || [];

        set((state) => {
          state.loading = false;
          state.data = oldData.concat(users || []);
          state.isLoadingMore = false;
          state.canLoadMore = users.length === params.limit;
        }, 'loadMoreReactionDetailSuccess');
      })
      .catch((error) => {
        console.warn('\x1b[35m🐣️ loadMoreReactionDetail error ', error, '\x1b[0m');
        set((state) => {
          state.isLoadingMore = false;
          state.canLoadMore = false;
        }, 'loadMoreReactionDetailError');
      });
  },
  reset: () => resetStore(initState, set),
});

const useReactionDetailStore = createStore<IReactionDetailState>(
  useReactionDetail,
);

export default useReactionDetailStore;
