import { IParamGetReactionDetail } from '~/interfaces/IPost';
import IBaseState from '~/store/interfaces/IBaseState';
import IFetchingState from '~/store/interfaces/IFetchingState';

interface IReactionDetailState extends IBaseState, IFetchingState{
  data: any[],
  loading: boolean,
  canLoadMore: boolean,
  isLoadingMore: boolean,
  doGetReactionDetail?: (params: IParamGetReactionDetail) => void;
  doLoadMoreReactionDetail?: (params: IParamGetReactionDetail) => void;
}

export default IReactionDetailState;
