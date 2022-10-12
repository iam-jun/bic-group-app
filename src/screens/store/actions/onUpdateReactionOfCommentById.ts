import { cloneDeep } from 'lodash';
import {
  ICommentData,
  IOwnReaction,
  IReactionCounts,
} from '~/interfaces/IPost';
import useCommentsStore from '~/store/entities/comments';

const onUpdateReactionOfCommentById = (_set, _get) => (
  commentId: string,
  ownReaction: IOwnReaction,
  reactionCounts: IReactionCounts,
  defaultComment?: ICommentData,
) => {
  try {
    const allComments = useCommentsStore.getState().comments || {};
    const comment: ICommentData = allComments?.[commentId] || defaultComment || {};
    const newComment = { ...comment };
    newComment.reactionsCount = reactionCounts;
    newComment.ownerReactions = ownReaction;
    allComments[commentId] = cloneDeep(newComment);
    useCommentsStore.getState().actions.setComments({ ...allComments });
  } catch (e) {
    console.error(
      '\x1b[31m', '🐣️ onUpdateReactionOfPost error: ', e, '\x1b[0m',
    );
  }
};

export default onUpdateReactionOfCommentById;
