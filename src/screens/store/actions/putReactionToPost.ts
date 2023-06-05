import {
  IOwnReaction, IPayloadReactToPost, IReaction, TargetType,
} from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import showToastError from '~/store/helper/showToastError';
import streamApi from '../../../api/StreamApi';
import { handleNewOwnReaction2 } from './helper';

const putReactionToPost = (_set, get) => async (
  payload: IPayloadReactToPost,
  targetType: TargetType,
) => {
  const {
    id, reactionId, ownReaction, reactionsCount,
  } = payload;
  const { actions } = get();
  try {
    const post1 = usePostsStore.getState()?.posts?.[id] || {};
    const cReactionCounts1 = post1.reactionsCount || {};
    const cOwnReaction1 = post1.ownerReactions || [];

    const added = cOwnReaction1?.find((item: IReaction) => item?.reactionName === reactionId)?.id || '';
    if (added) return;

    let isAdded = false;

    const newOwnReaction1: IOwnReaction = [...cOwnReaction1];
    newOwnReaction1.push({ reactionName: reactionId, loading: true } as IReaction);

    const _cReactionCounts = { ...cReactionCounts1 };

    const _reactionsCountArray: any = Object.values(_cReactionCounts || {})?.map((reaction: any) => {
      const key = Object.keys(reaction || {})?.[0];
      if (key === reactionId) {
        reaction[key] += 1;
        isAdded = true;
      }
      return reaction;
    });

    if (!isAdded) {
      _reactionsCountArray.push({ [reactionId]: 1 });
    }

    const newReactionCounts: any = {};
    _reactionsCountArray.forEach((
      item: any, index: number,
    ) => {
      newReactionCounts[index.toString()] = item;
    });

    actions.onUpdateReactionOfPostById(
      id, newOwnReaction1, newReactionCounts,
    );

    const response = await
    streamApi.putReaction({
      reactionName: reactionId,
      target: targetType,
      targetId: id,
    });

    // Disable update data base on response because of
    // calculate wrong value when receive socket msg
    if (!response?.data) return;

    const post2 = usePostsStore.getState()?.posts?.[id] || {};
    const cReactionCounts2 = post2.reactionsCount || {};
    const cOwnReaction2 = post2.ownerReactions || [];
    const newOwnReaction2: IOwnReaction = handleNewOwnReaction2({ newOwnReaction2: [...cOwnReaction2], response });

    actions.onUpdateReactionOfPostById(
      id, [...newOwnReaction2], {
        ...cReactionCounts2,
      },
    );
  } catch (e) {
    // disable rollback in case error limit 21 reaction
    actions.onUpdateReactionOfPostById(
      id, ownReaction, reactionsCount,
    );
    showToastError(e);
  }
};

export default putReactionToPost;
