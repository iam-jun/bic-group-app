import {get} from 'lodash';
import {call, select} from 'redux-saga/effects';

import {
  ICommentData,
  IPayloadReactToComment,
  IReaction,
} from '~/interfaces/IPost';
import showError from '~/store/commonSaga/showError';
import postDataHelper from '../../helper/PostDataHelper';
import postKeySelector from '../keySelector';
import onUpdateReactionOfCommentById from './onUpdateReactionOfCommentById';

export default function* deleteReactToComment({
  payload,
}: {
  type: string;
  payload: IPayloadReactToComment;
}): any {
  const {id, comment, reactionId, reactionsCount, ownerReactions} = payload;
  try {
    const rId =
      ownerReactions?.find(
        (item: IReaction) => item?.reactionName === reactionId,
      )?.id || '';
    if (rId) {
      // yield addReactionLoadingLocal(id, reactionId, comment);

      yield call(postDataHelper.deleteReaction, {
        reactionId: rId,
        target: 'COMMENT',
        targetId: id,
        reactionName: reactionId,
      });

      yield removeReactionLocal(id, reactionId, comment);
    }
  } catch (e) {
    yield onUpdateReactionOfCommentById(
      id,
      ownerReactions,
      reactionsCount,
      comment,
    );
    yield showError(e);
  }
}

// function* addReactionLoadingLocal(
//   id: string,
//   reactionId: string,
//   comment: ICommentData,
// ): any {
//   const cComment1 = yield select(s =>
//     get(s, postKeySelector.commentById(id)),
//   ) || {};
//   const cReactionCount1 = cComment1.reactionsCount || {};
//   const cOwnReactions1 = cComment1.ownerReactions || [];

//   const newOwnReaction1: IOwnReaction = [...cOwnReactions1];
//   if (newOwnReaction1?.length > 0) {
//     newOwnReaction1.forEach((item: IReaction, index: number) => {
//       if (item?.reactionName === reactionId) {
//         item.loading = true;
//         newOwnReaction1[index] = {...item};
//       }
//     });
//   }
//   yield onUpdateReactionOfCommentById(
//     id,
//     newOwnReaction1,
//     {...cReactionCount1},
//     comment,
//   );
// }

function* removeReactionLocal(
  id: string,
  reactionId: string,
  comment: ICommentData,
): any {
  const cmt = yield select(s => get(s, postKeySelector.commentById(id))) || {};
  const reactionsCount = cmt.reactionsCount || {};
  const ownerReactions = cmt.ownerReactions || [];

  const newOwnerReactions = ownerReactions.filter?.(
    (or: IReaction) => or?.reactionName !== reactionId,
  );

  const newReactionCounts = reactionsCount;
  Object.keys(reactionsCount)?.map?.(k => {
    const _reactionId = Object.keys(reactionsCount?.[k])?.[0];
    const nextKey = `${Object.keys(reactionsCount).length}`;
    const _reactionCount = reactionsCount?.[k]?.[_reactionId] || 0;
    if (reactionId !== _reactionId) {
      newReactionCounts[nextKey] = {[_reactionId]: _reactionCount};
    } else {
      newReactionCounts[nextKey] = {
        [_reactionId]: Math.max(0, _reactionCount - 1),
      };
    }
  });

  yield onUpdateReactionOfCommentById(
    id,
    newOwnerReactions,
    newReactionCounts,
    comment,
  );
}
