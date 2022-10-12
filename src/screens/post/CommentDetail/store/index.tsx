import { IPayloadGetCommentsById } from '~/interfaces/IPost';
import {
  createStore,
} from '~/store/utils';
import getCommentDetail from './actions/getCommentDetail';

interface IGetCommentDetailController {
  actions: {
    getCommentDetail: (payload: IPayloadGetCommentsById) => void;
  }
}

const commentDetailController = (set, get) => ({
  actions: {
    getCommentDetail: getCommentDetail(set, get),
  },
});

const useCommentDetailController = createStore<IGetCommentDetailController>(commentDetailController);

export default useCommentDetailController;
