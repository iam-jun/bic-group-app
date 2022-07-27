import { get } from 'lodash';
import { put, select } from 'redux-saga/effects';

import {
  ICommentData,
  IOwnReaction,
  IReactionCounts,
} from '~/interfaces/IPost';
import postActions from '../actions';
import postKeySelector from '../keySelector';

export default function* onUpdateReactionOfCommentById(
  commentId: string,
  ownReaction: IOwnReaction,
  reactionCounts: IReactionCounts,
  defaultComment?: ICommentData,
): any {
  try {
    const allComments = yield select((state) => get(
      state, postKeySelector.allComments,
    )) || {};
    const comment: ICommentData = allComments?.[commentId] || defaultComment || {};
    const newComment = { ...comment };
    newComment.reactionsCount = reactionCounts;
    newComment.ownerReactions = ownReaction;
    allComments[commentId] = newComment;
    yield put(postActions.setAllComments(allComments));
  } catch (e) {
    console.error(
      '\x1b[31m', '🐣️ onUpdateReactionOfPost error: ', e, '\x1b[0m',
    );
  }
}
