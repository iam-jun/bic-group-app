import { IPayloadGetDraftPosts, IPostActivity } from '~/interfaces/IPost';
import IBaseStore from '~/store/interfaces/IBaseStore';

interface IDraftPostState extends IBaseStore, IFetchingStore{
  posts: IPostActivity[],
  hasNextPage: boolean,
  loading: boolean,
  refreshing: boolean,

  dispatchGetDraftPosts?: (payload: IPayloadGetDraftPosts) => void;

  reset?: () => void;
}

export default IDraftPostState;
