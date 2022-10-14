import { IAllPosts, IPayloadAddToAllPost, IPostActivity } from '~/interfaces/IPost';
import IBaseState from '~/store/interfaces/IBaseState';

interface IPostsState extends IBaseState{
  posts: {[id: string]: IPostActivity}
  actions?: {
    setPosts?: (payload?: IAllPosts) => void;
    addToPosts?: (payload: IPayloadAddToAllPost) => void;
  }
}

export default IPostsState;
