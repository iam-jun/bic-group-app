import { IPayloadGetDraftContents, IPost } from '~/interfaces/IPost';
import IBaseState from '~/store/interfaces/IBaseState';
import IFetchingState from '~/store/interfaces/IFetchingState';

interface IDraftPostState extends IBaseState, IFetchingState{
  posts: IPost[],
  hasNextPage: boolean,
  endCursor: string,
  loading: boolean,
  refreshing: boolean,

  actions?:{
    getDraftPosts?: (payload: IPayloadGetDraftContents) => void;
  }
}

export default IDraftPostState;
