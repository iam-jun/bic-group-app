import {get} from 'lodash';
import {put, select} from 'redux-saga/effects';

import {IOwnReaction, IReactionCounts} from '~/interfaces/IPost';
import postActions from '../actions';
import postKeySelector from '../keySelector';

export default function* onUpdateReactionOfPostById(
  postId: string,
  ownReaction: IOwnReaction,
  reactionCounts: IReactionCounts,
): any {
  try {
    const post = yield select(state =>
      get(state, postKeySelector.postById(postId)),
    );
    post.reactionsCount = reactionCounts;
    post.ownerReactions = ownReaction;
    yield put(postActions.addToAllPosts({data: post}));
  } catch (e) {
    console.log('\x1b[31m', '🐣️ onUpdateReactionOfPost error: ', e, '\x1b[0m');
  }
}
