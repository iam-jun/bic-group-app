import { isEmpty } from 'lodash';

import {
  IPayloadUpdateReaction,
  IReactionCounts,
  ISocketReaction,
} from '~/interfaces/IPost';
import useCommentsStore from '~/store/entities/comments';
import usePostsStore from '~/store/entities/posts';

const updateReactionBySocket = (_set, get) => (payload: IPayloadUpdateReaction) => {
  const { userId, data } = payload || {};
  const {
    reactionsCount,
    reaction,
    reactionsOfActor,
    comment,
    id,
  } = data as ISocketReaction;
  const { actions } = get();

  if (!isEmpty(reaction)) {
    // handle reaction to post
    // merge own reaction if reaction's actor is current user
    const p = usePostsStore.getState()?.posts?.[id] || {};
    const ownReactions = p?.ownerReactions ? [...p.ownerReactions] : [];
    const isCurrentUser = userId.toString() == reaction?.actor?.id;
    actions.onUpdateReactionOfPostById(
      id,
      isCurrentUser && !!reaction?.reactionName
        ? reactionsOfActor
        : ownReactions,
      reactionsCount as IReactionCounts,
    );
  }

  if (!isEmpty(comment)) {
    // handle reaction to comment
    const {
      id: _cId,
      reactionsOfActor: _cOwnerReactions,
      reaction: _cReaction,
      reactionsCount: _cReactionsCount,
      child,
    } = comment as any;

    let finalId = _cId;
    let finalReaction = _cReaction;
    let finalOwnerReactions = _cOwnerReactions;
    let finalReactionsCount = _cReactionsCount;
    let isCurrentUser = userId == _cReaction?.actor?.id;
    if (!isEmpty(child)) {
      finalId = child?.id;
      finalReaction = child?.reaction;
      finalOwnerReactions = child?.reactionsOfActor;
      finalReactionsCount = child?.reactionsCount;
      isCurrentUser = userId == child?.actor?.id;
    }
    // merge own children if reaction's actor is current user
    const c = useCommentsStore.getState().comments?.[finalId] || {};
    const ownReactions = c?.ownerReactions ? [...c.ownerReactions] : [];

    actions.onUpdateReactionOfCommentById(
      finalId,
      isCurrentUser && finalReaction?.reactionName
        ? finalOwnerReactions
        : ownReactions,
      finalReactionsCount as IReactionCounts,
      undefined,
    );
  }
};

export default updateReactionBySocket;
