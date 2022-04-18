import {get} from 'lodash';
import {call, select} from 'redux-saga/effects';

import {
  IOwnReaction,
  IPayloadReactToComment,
  IReaction,
} from '~/interfaces/IPost';
import showError from '~/store/commonSaga/showError';
import postDataHelper from '../../helper/PostDataHelper';
import postKeySelector from '../keySelector';
import onUpdateReactionOfCommentById from './onUpdateReactionOfCommentById';

export default function* deleteReactToComment({
  payload,
}: {
  type: string;
  payload: IPayloadReactToComment;
}): any {
  const {id, comment, reactionId, reactionsCount, ownerReactions} = payload;
  try {
    const rId =
      ownerReactions?.find(
        (item: IReaction) => item?.reactionName === reactionId,
      )?.id || '';
    if (rId) {
      const cComment1 = yield select(s =>
        get(s, postKeySelector.commentById(id)),
      ) || {};
      const cReactionCount1 = cComment1.reactionsCount || {};
      const cOwnReactions1 = cComment1.ownerReactions || [];

      const newOwnReaction1: IOwnReaction = [...cOwnReactions1];
      if (newOwnReaction1?.length > 0) {
        newOwnReaction1.forEach((item: IReaction, index: number) => {
          if (item?.reactionName === reactionId) {
            item.loading = true;
            newOwnReaction1[index] = {...item};
          }
        });
      }
      yield onUpdateReactionOfCommentById(
        id,
        newOwnReaction1,
        {...cReactionCount1},
        comment,
      );

      yield call(postDataHelper.deleteReaction, {
        reactionId: rId,
        target: 'COMMENT',
      });
    }
  } catch (e) {
    yield onUpdateReactionOfCommentById(
      id,
      ownerReactions,
      reactionsCount,
      comment,
    );
    yield showError(e);
  }
}
