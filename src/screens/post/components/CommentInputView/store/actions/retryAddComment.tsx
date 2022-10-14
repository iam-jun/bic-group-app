import { IPayloadCreateComment, IReaction } from '~/interfaces/IPost';
import ICommentInputState from '../Interface';

const retryAddComment = (_set, get) => (payload: IReaction) => {
  const {
    postId, actor, parentCommentId, localId,
  } = payload;
  const currentComment: IPayloadCreateComment = {
    localId,
    postId,
    parentCommentId,
    commentData: { ...payload },
    userId: actor?.id,
  };
  /**
   * preComment exists only when creating new comment from text input
   * when retrying, the preComment already exists in the data store
   * only need to update the data from API
   */
  const { actions }: ICommentInputState = get();
  actions.createComment(currentComment);
};

export default retryAddComment;
