import {get, isEmpty} from 'lodash';
import {select} from 'redux-saga/effects';
import {ReactionType} from '~/constants/reactions';

import {
  IOwnReaction,
  IPayloadReactToComment,
  IReaction,
} from '~/interfaces/IPost';
import showError from '~/store/commonSaga/showError';
import postDataHelper from '../../helper/PostDataHelper';
import postKeySelector from '../keySelector';
import onUpdateReactionOfCommentById from './onUpdateReactionOfCommentById';

export default function* putReactionToComment({
  payload,
}: {
  type: string;
  payload: IPayloadReactToComment;
}): any {
  const {
    id,
    comment,
    postId,
    parentCommentId,
    reactionId,
    reactionCounts,
    ownReaction,
  } = payload;
  const isChildComment = !!parentCommentId;

  if (!postId) {
    console.log(
      `\x1b[31m🐣️ saga putReactionToComment: postId not found\x1b[0m`,
    );
    return;
  }
  try {
    const cComment1 =
      (yield select(s => get(s, postKeySelector.commentById(id)))) || comment;
    const cReactionCount1 = cComment1.reactionsCount || {};
    const cOwnReaction1 = cComment1.ownerReactions || [];

    const added =
      cOwnReaction1?.find(
        (item: IReaction) => item?.reactionName === reactionId,
      )?.id || '';

    if (!added) {
      let isAdded1 = false,
        isAdded2 = false;

      const newOwnReaction1: IOwnReaction = [...cOwnReaction1];
      if (newOwnReaction1?.length > 0) {
        newOwnReaction1.forEach((ownReaction, index) => {
          if (ownReaction?.reactionName === reactionId) {
            ownReaction.loading = true;
            newOwnReaction1[index] = {...ownReaction};
            isAdded1 = true;
          }
        });
      } else {
        isAdded1 = true;
        newOwnReaction1.push({reactionName: reactionId, loading: true});
      }

      if (!isAdded1) {
        newOwnReaction1.push({reactionName: reactionId, loading: true});
      }

      const newReactionCounts1 = {...cReactionCount1};
      for (const [key, value] of Object.entries(newReactionCounts1 || {})) {
        const _reactionName = Object.keys((value as any) || {})?.[0];
        if (_reactionName === reactionId) {
          isAdded2 = true;
          newReactionCounts1[key][reactionId] =
            (newReactionCounts1[key][reactionId] || 0) + 1;
        }
      }

      if (!isAdded2) {
        const lastKey = !isEmpty(newReactionCounts1)
          ? Object.keys(newReactionCounts1).pop()
          : '0';

        if (typeof lastKey === 'string') {
          const key = (parseInt(lastKey, 10) + 1).toString();
          if (!!key) {
            const newData = {[reactionId]: 1};
            newReactionCounts1[key] = {...newData};
          }
        }
      }

      yield onUpdateReactionOfCommentById(
        id,
        newOwnReaction1,
        newReactionCounts1,
        comment,
      );

      yield postDataHelper.putReaction({
        reactionName: reactionId,
        target: 'COMMENT',
        targetId: id,
      });
    }
  } catch (e) {
    yield showError(e);
  }
}
