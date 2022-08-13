import { get } from 'lodash';
import { call, select } from 'redux-saga/effects';

import { IPayloadReactToPost, IReaction } from '~/interfaces/IPost';
import showError from '~/storeRedux/commonSaga/showError';
import postDataHelper from '../../../api/PostDataHelper';
import postKeySelector from '../keySelector';
import onUpdateReactionOfPostById from './onUpdateReactionOfPostById';

export default function* deleteReactToPost({
  payload,
}: {
  type: string;
  payload: IPayloadReactToPost;
}): any {
  const {
    id, reactionId, reactionCounts, ownReaction,
  } = payload;
  const post1 = yield select((s) => get(
    s, postKeySelector.postById(id),
  ));
  try {
    const cOwnReaction1 = post1.ownerReactions || [];
    const rId = cOwnReaction1?.find((item: IReaction) => item?.reactionName === reactionId)?.id || '';
    if (rId) {
      yield removeReactionLocal(
        id, reactionId,
      );
      yield call(
        postDataHelper.deleteReaction, {
          reactionId: rId,
          target: 'POST',
          targetId: id,
          reactionName: reactionId,
        },
      );
    }
  } catch (e) {
    yield onUpdateReactionOfPostById(
      id, ownReaction, reactionCounts,
    ); // rollback
    yield showError(e);
  }
}

// function* addReactionLoadingLocal(
//   id: string,
//   reactionId: string,
//   ownerReaction: IOwnReaction,
//   reactionCounts: IReactionCounts,
// ): any {
//   const newOwnReaction1: IOwnReaction = [...ownerReaction];

//   if (newOwnReaction1?.length > 0) {
//     newOwnReaction1.forEach((ownReaction, index) => {
//       if (ownReaction?.reactionName === reactionId) {
//         ownReaction.loading = true;
//         newOwnReaction1[index] = {...ownReaction};
//       }
//     });
//   }

//   yield onUpdateReactionOfPostById(id, newOwnReaction1, {
//     ...reactionCounts,
//   });
// }

function* removeReactionLocal(
  id: string, reactionId: string,
): any {
  const post2 = yield select((s) => get(
    s, postKeySelector.postById(id),
  ));
  const cOwnerReactions2 = post2.ownerReactions || [];
  const cReactionCounts2 = post2.reactionsCount || {};
  const newOwnerReactions2 = cOwnerReactions2?.filter?.((or: IReaction) => or?.reactionName !== reactionId);
  const newReactionCounts2: any = {};
  Object.keys(cReactionCounts2)?.forEach?.((k) => {
    const _reactionId = Object.keys(cReactionCounts2?.[k])?.[0];
    const nextKey = `${Object.keys(newReactionCounts2).length}`;
    const _reactionCount = cReactionCounts2?.[k]?.[_reactionId] || 0;
    if (reactionId !== _reactionId) {
      newReactionCounts2[nextKey] = { [_reactionId]: _reactionCount };
    } else {
      newReactionCounts2[nextKey] = {
        [_reactionId]: Math.max(
          0, _reactionCount - 1,
        ),
      };
    }
  });
  yield onUpdateReactionOfPostById(
    id, newOwnerReactions2, newReactionCounts2,
  );
}
