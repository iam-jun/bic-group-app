import { IParamGetReactionDetail } from '~/interfaces/IPost';
import IBaseState from '~/store/interfaces/IBaseState';
import IFetchingState from '~/store/interfaces/IFetchingState';

interface IReactionDetailState extends IBaseState, IFetchingState{
  data: any[],
  loading: boolean,
  canLoadMore: boolean,
  isLoadingMore: boolean,
  actions: {
    getReactionDetail: (payload: IParamGetReactionDetail) => void,
    loadMoreReactionDetail: (payload: IParamGetReactionDetail) => void,
  }
}

export default IReactionDetailState;
