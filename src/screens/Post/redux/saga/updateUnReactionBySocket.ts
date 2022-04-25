import {get} from 'lodash';
import {select} from 'redux-saga/effects';

import {
  IPayloadUpdateReaction,
  IReaction,
  ISocketReaction,
} from '~/interfaces/IPost';
import postKeySelector from '../keySelector';
import onUpdateReactionOfCommentById from './onUpdateReactionOfCommentById';
import onUpdateReactionOfPostById from './onUpdateReactionOfPostById';

export default function* updateUnReactionBySocket({
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
    entityId = -1,
  } = data as ISocketReaction;

  const isCurrentUser = userId == actor?.id;

  if (type === 'react.post_creator') {
    // @ts-ignore
    const {reactionsCount, reaction = {}} = result || {};
    // handle un-react post
    const p =
      (yield select(state => get(state, postKeySelector.postById(entityId)))) ||
      {};
    const ownReactions = p?.ownerReactions ? [...p.ownerReactions] : [];
    const newOwnReaction2 = [] as any;

    if (isCurrentUser && reaction?.reactionName) {
      if (ownReactions?.length > 0) {
        ownReactions.forEach((item: IReaction) => {
          if (item?.reactionName !== reaction.reactionName) {
            newOwnReaction2.push(item);
          }
        });
      }
    }
    yield onUpdateReactionOfPostById(entityId, newOwnReaction2, reactionsCount);
  }

  if (type === 'react.comment_creator') {
    // @ts-ignore
    const {reactionsCount, reaction = {}} = result || {};
    // handle reaction to comment
    // merge own children if reaction's actor is current user
    const c =
      (yield select(s => get(s, postKeySelector.commentById(entityId)))) || {};
    const ownReactions = c?.ownerReactions ? [...c.ownerReactions] : [];
    const newOwnReaction2 = [] as any;

    if (isCurrentUser && reaction?.reactionName) {
      if (ownReactions?.length > 0) {
        ownReactions.forEach((item: IReaction) => {
          if (item?.reactionName !== reaction.reactionName) {
            newOwnReaction2.push(item);
          }
        });
      }
    }
    yield onUpdateReactionOfCommentById(
      entityId,
      newOwnReaction2,
      reactionsCount,
      undefined,
    );
  }
}
