import { IPayloadGetDraftPosts, IPostActivity } from '~/interfaces/IPost';
import IBaseStore from '~/store/interfaces/IBaseStore';
import { IFetchingStore } from '~/store/interfaces/IFetchingStore';

interface IDraftPostState extends IBaseStore, IFetchingStore{
  posts: IPostActivity[],
  hasNextPage: boolean,
  loading: boolean,
  refreshing: boolean,

  doGetDraftPosts?: (payload: IPayloadGetDraftPosts) => void;
}

export default IDraftPostState;
