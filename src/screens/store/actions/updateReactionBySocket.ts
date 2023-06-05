import { isEmpty } from 'lodash';

import {
  IPayloadUpdateReaction,
  IReactionCounts,
} from '~/interfaces/IPost';
import useCommentsStore from '~/store/entities/comments';
import usePostsStore from '~/store/entities/posts';

const updateReactionBySocket
  = (_set, get) => (payload: IPayloadUpdateReaction) => {
    const { userId, data } = payload || {};
    const {
      reactionsCount, reaction, reactionsOfActor, comment, id,
    }
      = data;
    const { actions } = get();

    if (!isEmpty(reaction)) {
      // handle reaction to post
      // merge own reaction if reaction's actor is current user
      const p = usePostsStore.getState()?.posts?.[id] || {};
      const ownReactions = handleOwnReactions(p);
      const isCurrentUser = userId.toString() == reaction?.actor?.id;

      const isHandleSocket = checkHandleSocket({ ownReactions, reaction, isCurrentUser });
      if (!isHandleSocket) {
        return;
      }

      actions.onUpdateReactionOfPostById(
        id,
        isCurrentUser && !!reaction?.reactionName
          ? reactionsOfActor
          : ownReactions,
        reactionsCount,
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
      const ownReactions = handleOwnReactions(c);

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

const handleOwnReactions = (item: any) => {
  if (item?.ownerReactions) {
    return [...item.ownerReactions];
  }
  return [];
};

const checkHandleSocket = (params: { ownReactions: any, reaction: any, isCurrentUser: boolean }) => {
  const { ownReactions, reaction, isCurrentUser } = params;
  const currentReactionState
    = ownReactions.find(
      (item) => item.reactionName === reaction?.reactionName,
    ) || {};

  // in case of isCurrentUser === true
  // & calling put/delete reaction api is pending (socket arrived before api response)
  // then no need to handle socket
  if (isCurrentUser && currentReactionState.loading) return false;
  return true;
};

export default updateReactionBySocket;
