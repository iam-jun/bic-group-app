import { get } from 'lodash';
import { call, select } from 'redux-saga/effects';

import { IOwnReaction, IPayloadReactToPost, IReaction } from '~/interfaces/IPost';
import showError from '~/storeRedux/commonSaga/showError';
import streamApi from '../../../api/StreamApi';
import postKeySelector from '../keySelector';
import onUpdateReactionOfPostById from './onUpdateReactionOfPostById';

export default function* putReactionToPost({
  payload,
}: {
  type: string;
  payload: IPayloadReactToPost;
}): any {
  const {
    id, reactionId, ownReaction, reactionCounts,
  } = payload;
  try {
    const post1 = yield select((s) => get(
      s, postKeySelector.postById(id),
    ));
    const cReactionCounts1 = post1.reactionsCount || {};
    const cOwnReaction1 = post1.ownerReactions || [];

    const added = cOwnReaction1?.find((item: IReaction) => item?.reactionName === reactionId)?.id || '';
    if (!added) {
      let isAdded = false;

      const newOwnReaction1: IOwnReaction = [...cOwnReaction1];
      newOwnReaction1.push({ reactionName: reactionId, loading: true } as IReaction);

      const _cReactionCounts = { ...cReactionCounts1 };

      const _reactionsCountArray: any = Object.values(_cReactionCounts || {})?.map((reaction: any) => {
        const key = Object.keys(reaction || {})?.[0];
        if (key === reactionId) {
          reaction[key] += 1;
          isAdded = true;
        }
        return reaction;
      });

      if (!isAdded) {
        _reactionsCountArray.push({ [reactionId]: 1 });
      }

      const newReactionCounts: any = {};
      _reactionsCountArray.forEach((
        item: any, index: number,
      ) => {
        newReactionCounts[index.toString()] = item;
      });

      yield onUpdateReactionOfPostById(
        id, newOwnReaction1, newReactionCounts,
      );

      const response = yield call(
        streamApi.putReaction, {
          reactionName: reactionId,
          target: 'POST',
          targetId: id,
        },
      );

      // Disable update data base on response because of
      // calculate wrong value when receive socket msg
      if (response?.data) {
        const post2 = yield select((s) => get(
          s, postKeySelector.postById(id),
        ));
        const cReactionCounts2 = post2.reactionsCount || {};
        const cOwnReaction2 = post2.ownerReactions || [];
        const newOwnReaction2: IOwnReaction = [...cOwnReaction2];

        if (newOwnReaction2?.length > 0) {
          let isAdded = false;
          newOwnReaction2.forEach((
            ownReaction: IReaction, index: number,
          ) => {
            if (ownReaction?.reactionName === response.data?.reactionName) {
              newOwnReaction2[index] = { ...response.data };
              isAdded = true;
            }
          });
          if (!isAdded) {
            newOwnReaction2.push(response.data);
          }
        } else {
          newOwnReaction2.push(response.data);
        }

        yield onUpdateReactionOfPostById(
          id, [...newOwnReaction2], {
            ...cReactionCounts2,
          },
        );
      }
    }
  } catch (e) {
    // disable rollback in case error limit 21 reaction
    yield onUpdateReactionOfPostById(
      id, ownReaction, reactionCounts,
    );
    yield showError(e);
  }
}
