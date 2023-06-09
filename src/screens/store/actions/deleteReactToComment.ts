import {
  ICommentData,
  IPayloadReactToComment,
  IReaction,
  TargetType,
} from '~/interfaces/IPost';
import useCommentsStore from '~/store/entities/comments';
import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';

const deleteReactToComment
  = (_set, get) => async (payload: IPayloadReactToComment) => {
    const {
      id, comment, reactionId, reactionsCount, ownerReactions,
    } = payload;
    const { actions } = get();
    try {
      const reaction
        = ownerReactions?.find(
          (item: IReaction) => item?.reactionName === reactionId,
        );
      if (reaction) {
        await streamApi.deleteReaction({
          target: TargetType.COMMENT,
          targetId: id,
          reactionName: reactionId,
        });

        removeReactionLocal(get)(id, reactionId, comment);
      }
    } catch (e) {
      actions.onUpdateReactionOfCommentById(
        id,
        ownerReactions,
        reactionsCount,
        comment,
      );
      showToastError(e);
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

const removeReactionLocal
  = (get) => (id: string, reactionId: string, comment: ICommentData) => {
    const { actions } = get();

    const cmt = useCommentsStore.getState().comments?.[id];
    const { reactionsCount = [], ownerReactions = [] } = cmt;

    const newOwnerReactions = ownerReactions.filter?.(
      (or: IReaction) => or?.reactionName !== reactionId,
    );
    const newReactionCounts = reactionsCount
      .map((item) => {
        const keysItem = Object.keys(item);

        if (keysItem.length === 0) return null;

        const reactionName = keysItem[0];
        const value = item[reactionName];

        if (reactionName === reactionId) {
          return {
            [reactionName]: Math.max(0, value - 1),
          };
        }

        return item;
      })
      .filter((item) => !!item && !!Object.values(item)[0]);

    actions.onUpdateReactionOfCommentById(
      id,
      newOwnerReactions,
      newReactionCounts,
      comment,
    );
  };

export default deleteReactToComment;
