import {get} from 'lodash';
import {call, select} from 'redux-saga/effects';

import {IOwnReaction, IPayloadReactToPost, IReaction} from '~/interfaces/IPost';
import showError from '~/store/commonSaga/showError';
import postDataHelper from '../../helper/PostDataHelper';
import postKeySelector from '../keySelector';
import onUpdateReactionOfPostById from './onUpdateReactionOfPostById';

export default function* deleteReactToPost({
  payload,
}: {
  type: string;
  payload: IPayloadReactToPost;
}): any {
  const {id, reactionId, reactionCounts, ownReaction} = payload;
  const post1 = yield select(s => get(s, postKeySelector.postById(id)));
  try {
    const cReactionCounts1 = post1.reactionsCount || {};
    const cOwnReaction1 = post1.ownerReactions || [];
    const rId =
      cOwnReaction1?.find(
        (item: IReaction) => item?.reactionName === reactionId,
      )?.id || '';

    if (rId) {
      const newOwnReaction1: IOwnReaction = [...cOwnReaction1];

      if (newOwnReaction1?.length > 0) {
        newOwnReaction1.forEach((ownReaction, index) => {
          if (ownReaction?.reactionName === reactionId) {
            ownReaction.loading = true;
            newOwnReaction1[index] = {...ownReaction};
          }
        });
      }

      yield onUpdateReactionOfPostById(id, newOwnReaction1, {
        ...cReactionCounts1,
      });

      yield call(postDataHelper.deleteReaction, {
        reactionId: rId,
        target: 'POST',
      });
    }
  } catch (e) {
    yield onUpdateReactionOfPostById(id, ownReaction, reactionCounts); //rollback
    yield showError(e);
  }
}
