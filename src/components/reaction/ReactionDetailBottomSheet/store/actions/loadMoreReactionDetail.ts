import streamApi from '~/api/StreamApi';
import { IParamGetReactionDetail } from '~/interfaces/IPost';

const loadMoreReactionDetail = (set, get) => async (params: IParamGetReactionDetail) => {
  try {
    set((state) => { state.isLoadingMore = true; }, 'loadMoreReactionDetail');
    const response = await streamApi.getReactionDetail(params);
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
  } catch (error) {
    console.warn('\x1b[35m🐣️ loadMoreReactionDetail error ', error, '\x1b[0m');
    set((state) => {
      state.isLoadingMore = false;
      state.canLoadMore = false;
    }, 'loadMoreReactionDetailError');
  }
};

export default loadMoreReactionDetail;
