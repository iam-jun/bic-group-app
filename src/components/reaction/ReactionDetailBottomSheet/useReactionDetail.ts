import { createZustand } from '~/store/utils';
import streamApi from '~/api/StreamApi';
import { IParamGetReactionDetail } from '~/interfaces/IPost';

interface GetReactionDetailState {
  data?: any[],
  loading: boolean,
  getReactionDetail: (params: IParamGetReactionDetail) => void;
}

const useReactionDetail = (set) => ({
  data: undefined,
  loading: false,
  getReactionDetail: (params: IParamGetReactionDetail) => {
    set((state) => { state.loading = true; }, false, 'getReactionDetail');
    streamApi.getReactionDetail(params)
      .then((response) => {
        const users = (response?.list || []).map((item: any) => ({
          id: item?.actor?.id,
          avatar: item?.actor?.avatar,
          fullname: item?.actor?.fullname,
          username: item?.actor?.username,
        }));
        set((state) => {
          state.loading = false;
          state.data = users || [];
        }, false, 'getReactionDetailSuccess');
      })
      .catch((error) => {
        console.warn('\x1b[35m🐣️ getReactionDetail error ', error, '\x1b[0m');
        set((state) => {
          state.loading = false;
        }, false, 'getReactionDetailError');
      });
  },
});

const useReactionDetailStore = createZustand<GetReactionDetailState>(
  'useReactionDetail', useReactionDetail,
);

export default useReactionDetailStore;
