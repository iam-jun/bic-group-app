import { IPayloadPutEditComment } from '~/interfaces/IPost';
import {
  createStore,
} from '~/store/utils';
import editComment from './actions/editComment';

interface IEditCommentController {
  actions: {
    editComment: (payload: IPayloadPutEditComment) => void;
  }
}

const editCommentController = (set, get) => ({
  actions: {
    editComment: editComment(set, get),
  },
});

const useEditCommentController = createStore<IEditCommentController>(editCommentController);

export default useEditCommentController;
