import { IPayloadDeleteComment } from '~/interfaces/IPost';
import {
  createStore,
} from '~/store/utils';
import deleteComment from './actions/deleteComment';

interface IDeleteCommentController {
  actions: {
    deleteComment: (payload: IPayloadDeleteComment) => void;
  }
}

const deleteCommentController = (set, get) => ({
  actions: {
    deleteComment: deleteComment(set, get),
  },
});

const useDeleteCommentController = createStore<IDeleteCommentController>(deleteCommentController);

export default useDeleteCommentController;
