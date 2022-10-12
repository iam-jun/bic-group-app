import { IPayloadGetCommentsById } from '~/interfaces/IPost';
import {
  createStore,
} from '~/store/utils';
import getCommentsByPostId from './actions/getCommentsByPostId';

interface ILoadMoreCommentsController {
  actions: {
    getCommentsByPostId: (payload: IPayloadGetCommentsById) => void;
  }
}

const loadMoreCommentsController = (set, get) => ({
  actions: {
    getCommentsByPostId: getCommentsByPostId(set, get),
  },
});

const useLoadMoreCommentsController = createStore<ILoadMoreCommentsController>(loadMoreCommentsController);

export default useLoadMoreCommentsController;
