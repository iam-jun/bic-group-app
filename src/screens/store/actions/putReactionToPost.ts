import {
  IOwnReaction, IPayloadReactToPost, IReaction, TargetType,
} from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import showToastError from '~/store/helper/showToastError';
import streamApi from '../../../api/StreamApi';
import { trackEvent } from '~/services/tracking';
import { TrackingEventEmojiReactedProperties } from '~/services/tracking/Interface';
import { TrackingEventType } from '~/services/tracking/constants';

const putReactionToPost = (_set, get) => async (
  payload: IPayloadReactToPost,
  targetType: TargetType,
) => {
  const {
    id, reactionId, ownReaction, reactionsCount,
  } = payload;
  const { actions } = get();
  try {
    const post1 = usePostsStore.getState()?.posts?.[id] || {};
    const cReactionCounts1 = post1.reactionsCount || [];
    const cOwnReaction1 = post1.ownerReactions || [];

    const added = cOwnReaction1?.find((item: IReaction) => item?.reactionName === reactionId)?.id || '';
    if (!added) {
      let isAdded = false;

      const newOwnReaction1: IOwnReaction = [...cOwnReaction1];
      newOwnReaction1.push({ reactionName: reactionId, loading: true } as IReaction);

      const newReactionCounts = cReactionCounts1.map((item) => {
        const reactionName = Object.keys(item)[0];

        if (reactionName === reactionId) {
          isAdded = true;
          return {
            [reactionName]: item[reactionName] + 1,
          };
        }

        return item;
      });

      if (!isAdded) {
        newReactionCounts.push({ [reactionId]: 1 });
      }

      actions.onUpdateReactionOfPostById(
        id, newOwnReaction1, newReactionCounts,
      );

      const response = await
      streamApi.putReaction({
        reactionName: reactionId,
        target: targetType,
        targetId: id,
      });

      // Disable update data base on response because of
      // calculate wrong value when receive socket msg
      if (response?.data) {
        const post2 = usePostsStore.getState()?.posts?.[id] || {};
        const cReactionCounts2 = post2.reactionsCount || [];
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

        actions.onUpdateReactionOfPostById(
          id, [...newOwnReaction2], [
            ...cReactionCounts2,
          ],
        );

        // tracking event
        const eventEmojiReactedProperties: TrackingEventEmojiReactedProperties = {
          reaction_name: reactionId,
        };
        trackEvent({ event: TrackingEventType.EMOJI_REACTED, properties: eventEmojiReactedProperties });
      }
    }
  } catch (e) {
    // disable rollback in case error limit 21 reaction
    actions.onUpdateReactionOfPostById(
      id, ownReaction, reactionsCount,
    );
    showToastError(e);
  }
};

export default putReactionToPost;
