import {get} from 'lodash';
import {call, select} from 'redux-saga/effects';

import {IOwnReaction, IPayloadReactToPost, IReaction} from '~/interfaces/IPost';
import showError from '~/store/commonSaga/showError';
import postDataHelper from '../../helper/PostDataHelper';
import postKeySelector from '../keySelector';
import onUpdateReactionOfPostById from './onUpdateReactionOfPostById';

export default function* putReactionToPost({
  payload,
}: {
  type: string;
  payload: IPayloadReactToPost;
}): any {
  const {id, reactionId} = payload;
  try {
    const post1 = yield select(s => get(s, postKeySelector.postById(id)));
    const cReactionCounts1 = post1.reactionsCount || {};
    const cOwnReaction1 = post1.ownerReactions || [];

    const added =
      cOwnReaction1?.find(
        (item: IReaction) => item?.reactionName === reactionId,
      )?.id || '';
    if (!added) {
      let isAdded1 = false;

      const newOwnReaction1: IOwnReaction = [...cOwnReaction1];
      if (newOwnReaction1?.length > 0) {
        newOwnReaction1.forEach((ownReaction, index) => {
          if (ownReaction?.reactionName === reactionId) {
            ownReaction.loading = true;
            newOwnReaction1[index] = {...ownReaction};
            isAdded1 = true;
          }
        });
      } else {
        isAdded1 = true;
        newOwnReaction1.push({reactionName: reactionId, loading: true});
      }

      if (!isAdded1) {
        newOwnReaction1.push({reactionName: reactionId, loading: true});
      }

      const _cReactionCounts = {...cReactionCounts1};
      let isAdded2 = false;

      const testArray: any = Object.values(_cReactionCounts || {})?.map(
        (reaction: any) => {
          const key = Object.keys(reaction || {})?.[0];
          if (key === reactionId) {
            reaction[key] = reaction[key] + 1;
            isAdded2 = true;
          }
          return reaction;
        },
      );

      if (!isAdded2) {
        testArray.push({[reactionId]: 1});
      }

      const newReactionCounts: any = {};
      testArray.forEach((item: any, index: number) => {
        newReactionCounts[index.toString()] = item;
      });

      yield onUpdateReactionOfPostById(id, newOwnReaction1, newReactionCounts);

      yield call(postDataHelper.putReaction, {
        reactionName: reactionId,
        target: 'POST',
        targetId: id,
      });

      // Disable update data base on response because of calculate wrong value when receive socket msg
      // if (response?.data?.[0]) {
      //   const post2 = yield select(s => get(s, postKeySelector.postById(id)));
      //   const cReactionCounts2 = post2.reaction_counts || {};
      //   const cOwnReaction2 = post2.own_reactions || {};
      //   const newOwnReaction2: IOwnReaction = {...cOwnReaction2};
      //
      //   const reactionArr2: IReaction[] = [];
      //   reactionArr2.push({id: response?.data?.[0]?.id});
      //   newOwnReaction2[reactionId] = reactionArr2;
      //
      //   yield onUpdateReactionOfPostById(
      //     id,
      //     {...newOwnReaction2},
      //     {...cReactionCounts2},
      //   );
      // }
    }
  } catch (e) {
    // disable rollback in case error limit 21 reaction
    // yield onUpdateReactionOfPostById(id, ownReaction, reactionCounts);
    yield showError(e);
  }
}
