import { IPayloadGetDraftPosts, IPost } from '~/interfaces/IPost';
import IBaseState from '~/store/interfaces/IBaseState';
import IFetchingState from '~/store/interfaces/IFetchingState';

interface IDraftPostState extends IBaseState, IFetchingState{
  posts: IPost[],
  hasNextPage: boolean,
  loading: boolean,
  refreshing: boolean,
  total: number,

  actions?:{
    getDraftPosts?: (payload: IPayloadGetDraftPosts) => void;
  }
}

export default IDraftPostState;
