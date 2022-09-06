import { IPayloadGetDraftPosts, IPostActivity } from '~/interfaces/IPost';

interface IDraftPostState {
  posts: IPostActivity[],
  canLoadMore: boolean,
  loading: boolean,
  refreshing: boolean,

  dispatchGetDraftPosts?: (payload: IPayloadGetDraftPosts) => void;

  reset?: () => void;
}

export default IDraftPostState;
