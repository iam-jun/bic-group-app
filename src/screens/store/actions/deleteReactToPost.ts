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
    const { ownerReactions = [], reactionsCount = [] } = post2;
    let newOwnerReactions2 = [...ownerReactions];
    let newReactionCounts2 = [...reactionsCount];

    if (preRemove) {
      newOwnerReactions2 = ownerReactions?.map?.((or: IReaction) => {
        if (or?.reactionName === reactionId) {
          return {
            ...or,
            loading: true,
          };
        }
        return or;
      });
    } else {
      newOwnerReactions2 = ownerReactions?.filter?.(
        (or: IReaction) => or?.reactionName !== reactionId,
      );

      newReactionCounts2 = reactionsCount.map((item) => {
        const reactionName = Object.keys(item)[0];
        const value = item[reactionName];

        if (reactionName === reactionId) {
          return {
            [reactionName]: Math.max(0, value - 1),
          };
        }
        return item;
      }).filter((item) => !!item && !!Object.values(item)[0]);
    }

    actions.onUpdateReactionOfPostById(
      id,
      newOwnerReactions2,
      newReactionCounts2,
    );
  };

export default deleteReactToPost;
