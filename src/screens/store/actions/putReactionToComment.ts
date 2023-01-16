import { isEmpty } from 'lodash';

import {
  IOwnReaction,
  IPayloadReactToComment,
  IReaction,
  TargetType,
} from '~/interfaces/IPost';
import useCommentsStore from '~/store/entities/comments';
import showToastError from '~/store/helper/showToastError';
import streamApi from '~/api/StreamApi';

const putReactionToComment = (_set, get) => async (payload: IPayloadReactToComment) => {
  const {
    id, comment, postId, reactionId, ownerReactions, reactionsCount,
  } = payload;

  if (!postId) {
    console.error('\x1b[31m🐣️ saga putReactionToComment: postId not found\x1b[0m');
    return;
  }
  const { actions } = get();
  try {
    const cComment1 = useCommentsStore.getState().comments?.[id] || comment;
    const cReactionCount1 = cComment1.reactionsCount || {};
    const cOwnReaction1 = cComment1.ownerReactions || [];

    const added = cOwnReaction1?.find((item: IReaction) => item?.reactionName === reactionId)?.id || '';

    if (!added) {
      let isAdded = false;

      const newOwnReaction1: IOwnReaction = [...cOwnReaction1];
      newOwnReaction1.push({ reactionName: reactionId, loading: true } as IReaction);

      const newReactionCounts1 = { ...cReactionCount1 };
      Object.keys(newReactionCounts1 || {}).forEach((key) => {
        const _reactionName = Object.keys((newReactionCounts1[key] as any) || {})?.[0];
        if (_reactionName === reactionId) {
          isAdded = true;
          newReactionCounts1[key][reactionId] = (newReactionCounts1[key][reactionId] || 0) + 1;
        }
      });

      if (!isAdded) {
        const lastKey = !isEmpty(newReactionCounts1)
          ? Object.keys(newReactionCounts1).pop()
          : '0';

        if (typeof lastKey === 'string') {
          const key = (parseInt(
            lastKey, 10,
          ) + 1).toString();
          if (key) {
            const newData = { [reactionId]: 1 };
            newReactionCounts1[key] = { ...newData };
          }
        }
      }
      actions.onUpdateReactionOfCommentById(
        id,
        newOwnReaction1,
        newReactionCounts1,
        comment,
      );

      const response = await
      streamApi.putReaction({
        reactionName: reactionId,
        target: TargetType.COMMENT,
        targetId: id,
      });

      if (response?.data) {
        const cComment2 = useCommentsStore.getState().comments?.[id] || comment;
        const cReactionsCount2 = cComment2.reactionsCount || {};
        const cOwnReactions2 = cComment2.ownerReactions || [];
        const newOwnReaction2: IOwnReaction = [...cOwnReactions2];

        if (newOwnReaction2?.length > 0) {
          let isAdded = false;
          newOwnReaction2.forEach((
            ownReaction: IReaction, index: number,
          ) => {
            if (ownReaction?.reactionName === response.data?.reactionName) {
              newOwnReaction2[index] = { ...response.data };
              isAdded = true;
            }
          });
          if (!isAdded) {
            newOwnReaction2.push(response.data);
          }
        } else {
          newOwnReaction2.push(response.data);
        }

        actions.onUpdateReactionOfCommentById(
          id,
          [...newOwnReaction2],
          {
            ...cReactionsCount2,
          },
          comment,
        );
      }
    }
  } catch (e) {
    // disable rollback in case error limit 21 reaction
    actions.onUpdateReactionOfCommentById(
      id,
      ownerReactions,
      reactionsCount,
      comment,
    );
    showToastError(e);
  }
};

export default putReactionToComment;
