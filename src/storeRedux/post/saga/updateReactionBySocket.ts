import { get, isEmpty } from 'lodash';
import { select } from 'redux-saga/effects';

import {
  IPayloadUpdateReaction,
  IReactionCounts,
  ISocketReaction,
} from '~/interfaces/IPost';
import postKeySelector from '../keySelector';
import onUpdateReactionOfCommentById from './onUpdateReactionOfCommentById';
import onUpdateReactionOfPostById from './onUpdateReactionOfPostById';

export default function* updateReactionBySocket({
  payload,
}: {
  type: string;
  payload: IPayloadUpdateReaction;
}): any {
  const { userId, data } = payload || {};
  const {
    reactionsCount,
    reaction,
    reactionsOfActor,
    comment,
    id,
  } = data as ISocketReaction;

  if (!isEmpty(reaction)) {
    // handle reaction to post
    // merge own reaction if reaction's actor is current user
    const p = (yield select((state) => get(
      state, postKeySelector.postById(id),
    ))) || {};
    const ownReactions = p?.ownerReactions ? [...p.ownerReactions] : [];
    const isCurrentUser = userId.toString() == reaction?.actor?.id;
    yield onUpdateReactionOfPostById(
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
    const c = (yield select((s) => get(
      s, postKeySelector.commentById(finalId || 0),
    )))
      || {};
    const ownReactions = c?.ownerReactions ? [...c.ownerReactions] : [];

    yield onUpdateReactionOfCommentById(
      finalId,
      isCurrentUser && finalReaction?.reactionName
        ? finalOwnerReactions
        : ownReactions,
      finalReactionsCount as IReactionCounts,
      undefined,
    );
  }
}
