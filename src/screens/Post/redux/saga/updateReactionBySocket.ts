import {get} from 'lodash';
import {select} from 'redux-saga/effects';

import {IPayloadUpdateReaction, ISocketReaction} from '~/interfaces/IPost';
import postKeySelector from '../keySelector';
import onUpdateReactionOfCommentById from './onUpdateReactionOfCommentById';
import onUpdateReactionOfPostById from './onUpdateReactionOfPostById';

export default function* updateReactionBySocket({
  payload,
}: {
  type: string;
  payload: IPayloadUpdateReaction;
}): any {
  const {userId, data} = payload || {};
  const {
    actor,
    type = '',
    result = {},
    entityId = '',
  } = data as ISocketReaction;

  const isCurrentUser = userId == actor?.id;

  if (type === 'react.post_creator') {
    // @ts-ignore
    const {reactionsCount, reaction = {}} = result || {};
    // handle reaction to post
    // merge own reaction if reaction's actor is current user
    const p =
      (yield select(state => get(state, postKeySelector.postById(entityId)))) ||
      {};
    const ownReactions = p?.ownerReactions ? [...p.ownerReactions] : [];
    if (isCurrentUser && reaction?.reactionName) {
      if (ownReactions?.length > 0) {
        ownReactions.forEach((ownReaction, index) => {
          if (ownReaction?.reactionName === reaction.reactionName) {
            ownReactions[index] = {...reaction};
          }
        });
      }
    }

    yield onUpdateReactionOfPostById(entityId, ownReactions, reactionsCount);
  }

  if (type === 'react.comment_creator') {
    // @ts-ignore
    const {reactionsCount, reaction = {}} = result || {};
    // handle reaction to comment
    // merge own children if reaction's actor is current user
    const c =
      (yield select(s => get(s, postKeySelector.commentById(entityId)))) || {};
    const ownReactions = c?.ownerReactions ? [...c.ownerReactions] : [];

    if (isCurrentUser && reaction?.reactionName) {
      if (ownReactions?.length > 0) {
        ownReactions.forEach((ownReaction, index) => {
          if (ownReaction?.reactionName === reaction.reactionName) {
            ownReactions[index] = {...reaction};
          }
        });
      }
    }
    yield onUpdateReactionOfCommentById(
      entityId?.toString(),
      ownReactions,
      reactionsCount,
      undefined,
    );
  }
}
