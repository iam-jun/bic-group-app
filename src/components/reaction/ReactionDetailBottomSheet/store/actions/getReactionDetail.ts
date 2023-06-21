import streamApi from '~/api/StreamApi';
import { IParamGetReactionDetail } from '~/interfaces/IPost';

const getReactionDetail = (set, _get) => async (params: IParamGetReactionDetail) => {
  try {
    set((state) => { state.loading = true; }, 'getReactionDetail');
    const response = await streamApi.getReactionDetail(params);
    const users = (response?.list || []).map((item: any) => ({
      id: item?.actor?.id,
      avatar: item?.actor?.avatar,
      fullname: item?.actor?.fullname,
      username: item?.actor?.username,
      isDeactivated: item?.actor?.isDeactivated,
      showingBadges: item?.actor?.showingBadges,
      reactionId: item?.id,
    }));
    set((state) => {
      state.loading = false;
      state.data = users || [];
      state.canLoadMore = users.length === params.limit;
    }, 'getReactionDetailSuccess');
  } catch (error) {
    console.warn('\x1b[35m🐣️ getReactionDetail error ', error, '\x1b[0m');
    set((state) => {
      state.loading = false;
    }, 'getReactionDetailError');
  }
};

export default getReactionDetail;
