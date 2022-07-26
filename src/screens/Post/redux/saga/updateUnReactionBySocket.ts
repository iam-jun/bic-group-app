import { get, isEmpty } from 'lodash';
import { select } from 'redux-saga/effects';

import {
  IPayloadUpdateReaction,
  IReaction,
  IReactionCounts,
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
  const { userId, data } = payload || {};
  const {
    reactionsCount, reaction = {}, comment, id,
  } = data as ISocketReaction;

  const _userId = userId.toString();

  const isCurrentUser = _userId === reaction?.actor?.id || _userId === comment?.actor?.id;

  if (!isEmpty(reactionsCount) && !isEmpty(reaction)) {
    // handle un-react post
    const p = (yield select((state) => get(state, postKeySelector.postById(id)))) || {};
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
    yield onUpdateReactionOfPostById(
      id,
      newOwnReaction2,
      reactionsCount as IReactionCounts,
    );
  }

  if (!isEmpty(comment)) {
    // handle reaction to comment
    // merge own children if reaction's actor is current user
    const c = (yield select((s) => get(s, postKeySelector.commentById(id)))) || {};
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
      id,
      newOwnReaction2,
      reactionsCount as IReactionCounts,
      undefined,
    );
  }
}
