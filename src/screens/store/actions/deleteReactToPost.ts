import { IPayloadReactToPost, IReaction, TargetType } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import showToastError from '~/store/helper/showToastError';
import streamApi from '~/api/StreamApi';

const deleteReactToPost
  = (_set, get) => async (payload: IPayloadReactToPost) => {
    const {
      id, reactionId, reactionsCount, ownReaction,
    } = payload;
    const { actions } = get();
    const post1 = usePostsStore.getState()?.posts?.[id] || {};
    try {
      const cOwnReaction1 = post1.ownerReactions || [];
      const rId
        = cOwnReaction1?.find(
          (item: IReaction) => item?.reactionName === reactionId,
        )?.id || '';
      if (rId) {
        removeReactionLocal(get)(id, reactionId, true);
        const response = await streamApi.deleteReaction({
          reactionId: rId,
          target: TargetType.POST,
          targetId: id,
          reactionName: reactionId,
        });

        if (response) {
          removeReactionLocal(get)(id, reactionId, false);
        }
      }
    } catch (e) {
      actions.onUpdateReactionOfPostById(id, ownReaction, reactionsCount); // rollback
      showToastError(e);
    }
  };

const removeReactionLocal
  = (get) => (id: string, reactionId: string, preRemove: boolean) => {
    const { actions } = get();

    const post2 = usePostsStore.getState()?.posts?.[id] || {};
    const cOwnerReactions2 = post2.ownerReactions || [];
    const cReactionCounts2 = post2.reactionsCount || {};
    let newOwnerReactions2 = [];
    const newReactionCounts2: any = { ...cReactionCounts2 };

    if (preRemove) {
      newOwnerReactions2 = cOwnerReactions2?.map?.((or: IReaction) => {
        if (or?.reactionName === reactionId) {
          return {
            ...or,
            loading: true,
          };
        }
        return or;
      });
    } else {
      newOwnerReactions2 = cOwnerReactions2?.filter?.(
        (or: IReaction) => or?.reactionName !== reactionId,
      );

      Object.keys(cReactionCounts2)?.forEach?.((k) => {
        const _reactionId = Object.keys(cReactionCounts2?.[k])?.[0];
        const _reactionCount = cReactionCounts2?.[k]?.[_reactionId] || 0;

        if (reactionId !== _reactionId) {
          newReactionCounts2[k] = { [_reactionId]: _reactionCount };
        } else {
          newReactionCounts2[k] = {
            [_reactionId]: Math.max(0, _reactionCount - 1),
          };
        }
      });
    }

    actions.onUpdateReactionOfPostById(
      id,
      newOwnerReactions2,
      newReactionCounts2,
    );
  };

export default deleteReactToPost;
