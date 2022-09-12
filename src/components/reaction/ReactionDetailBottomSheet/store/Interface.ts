import { IParamGetReactionDetail } from '~/interfaces/IPost';
import IBaseStore from '~/store/interfaces/IBaseStore';
import IFetchingStore from '~/store/interfaces/IFetchingStore';

interface IReactionDetailState extends IBaseStore, IFetchingStore{
  data: any[],
  loading: boolean,
  canLoadMore: boolean,
  isLoadingMore: boolean,
  doGetReactionDetail?: (params: IParamGetReactionDetail) => void;
  doLoadMoreReactionDetail?: (params: IParamGetReactionDetail) => void;
}

export default IReactionDetailState;
