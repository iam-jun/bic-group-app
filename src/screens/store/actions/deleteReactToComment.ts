import {
  ICommentData,
  IPayloadReactToComment,
  IReaction,
} from '~/interfaces/IPost';
import useCommentsStore from '~/store/entities/comments';
import streamApi from '~/api/StreamApi';
import showError from '~/store/helper/showError';

const deleteReactToComment = (_set, get) => async (
  payload: IPayloadReactToComment,
) => {
  const {
    id, comment, reactionId, reactionsCount, ownerReactions,
  } = payload;
  const { actions } = get();
  try {
    const rId = ownerReactions?.find((item: IReaction) => item?.reactionName === reactionId)?.id || '';
    if (rId) {
      // yield addReactionLoadingLocal(id, reactionId, comment);

      await streamApi.deleteReaction({
        reactionId: rId,
        target: 'COMMENT',
        targetId: id,
        reactionName: reactionId,
      });

      removeReactionLocal(get)(
        id, reactionId, comment,
      );
    }
  } catch (e) {
    actions.onUpdateReactionOfCommentById(
      id,
      ownerReactions,
      reactionsCount,
      comment,
    );
    showError(e);
  }
};

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

const removeReactionLocal = (get) => (
  id: string,
  reactionId: string,
  comment: ICommentData,
) => {
  const { actions } = get();

  const cmt = useCommentsStore.getState().comments?.[id];
  const reactionsCount = cmt.reactionsCount || {};
  const ownerReactions = cmt.ownerReactions || [];

  const newOwnerReactions = ownerReactions.filter?.((or: IReaction) => or?.reactionName !== reactionId);

  const newReactionCounts = reactionsCount;
  Object.keys(reactionsCount)?.forEach?.((k) => {
    const _reactionId = Object.keys(reactionsCount?.[k])?.[0];
    const nextKey = `${Object.keys(reactionsCount).length}`;
    const _reactionCount = reactionsCount?.[k]?.[_reactionId] || 0;
    if (reactionId !== _reactionId) {
      newReactionCounts[nextKey] = { [_reactionId]: _reactionCount };
    } else {
      newReactionCounts[nextKey] = {
        [_reactionId]: Math.max(
          0, _reactionCount - 1,
        ),
      };
    }
  });

  actions.onUpdateReactionOfCommentById(
    id,
    newOwnerReactions,
    newReactionCounts,
    comment,
  );
};

export default deleteReactToComment;
