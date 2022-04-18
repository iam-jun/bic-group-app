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
  const {id, comment, reactionId, reactionCounts, ownReaction} = payload;
  try {
    const rId =
      ownReaction?.find((item: IReaction) => item?.reactionName === reactionId)
        ?.id || '';
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

      // const cComment2 = yield select(s =>
      //   get(s, postKeySelector.commentById(id)),
      // ) || {};
      // const cReactionCount2 = cComment2.reactionsCount || {};
      // const cOwnReactions2 = cComment2.ownerReactions || {};

      // const newChildrenCounts2 = {...cReactionCount2};
      // newChildrenCounts2[reactionId] = Math.max(
      //   0,
      //   (newChildrenCounts2[reactionId] || 0) - 1,
      // );
      // const newOwnChildren2 = {...cOwnReactions2};
      // newOwnChildren2[reactionId] = [];
      // yield onUpdateReactionOfCommentById(
      //   id,
      //   newOwnChildren2,
      //   newChildrenCounts2,
      //   comment,
      // );
    }
  } catch (e) {
    yield onUpdateReactionOfCommentById(
      id,
      ownReaction,
      reactionCounts,
      comment,
    );
    yield showError(e);
  }
}
