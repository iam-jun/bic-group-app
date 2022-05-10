import {get, isEmpty} from 'lodash';
import {select} from 'redux-saga/effects';

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
  const {userId, data} = payload || {};
  const {reactionsCount, reaction = {}, comment, id} = data as ISocketReaction;

  const isCurrentUser =
    userId == reaction?.actor?.id || userId == comment?.actor?.id;
  if (!isEmpty(reactionsCount) && !isEmpty(reaction)) {
    // handle reaction to post
    // merge own reaction if reaction's actor is current user
    const p =
      (yield select(state => get(state, postKeySelector.postById(id)))) || {};
    const ownReactions = p?.ownerReactions ? [...p.ownerReactions] : [];
    if (isCurrentUser && reaction?.reactionName) {
      if (ownReactions?.length > 0) {
        let isAdded = false;
        ownReactions.forEach((ownReaction, index) => {
          if (ownReaction?.reactionName === reaction.reactionName) {
            ownReactions[index] = {...reaction};
            isAdded = true;
          }
        });
        if (!isAdded) {
          ownReactions.push(reaction);
        }
      } else {
        ownReactions.push(reaction);
      }
    }

    yield onUpdateReactionOfPostById(
      id,
      ownReactions,
      reactionsCount as IReactionCounts,
    );
  }

  if (!isEmpty(comment)) {
    // handle reaction to comment
    // merge own children if reaction's actor is current user
    const c =
      (yield select(s =>
        get(s, postKeySelector.commentById(comment?.id || 0)),
      )) || {};
    const ownReactions = c?.ownerReactions ? [...c.ownerReactions] : [];
    if (isCurrentUser && reaction?.reactionName) {
      if (ownReactions?.length > 0) {
        let isAdded = false;
        ownReactions.forEach((ownReaction, index) => {
          if (ownReaction?.reactionName === reaction.reactionName) {
            ownReactions[index] = {...reaction};
            isAdded = true;
          }
        });
        if (!isAdded) {
          ownReactions.push(reaction);
        }
      } else {
        ownReactions.push(reaction);
      }
    }
    yield onUpdateReactionOfCommentById(
      comment?.id as number,
      ownReactions,
      reactionsCount as IReactionCounts,
      undefined,
    );
  }
}
