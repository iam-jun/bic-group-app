import { IPayloadAddToAllPost, IPayloadPutMarkAsRead } from '~/interfaces/IPost';
import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import usePostsStore from '~/store/entities/posts';
import { trackEvent } from '~/services/tracking';
import { TrackingEventImportantMarkedProperties } from '~/services/tracking/Interface';
import { TrackingEventType } from '~/services/tracking/constants';

const putMarkAsRead = () => async (payload: IPayloadPutMarkAsRead) => {
  const { postId, callback } = payload;

  if (!postId) {
    console.error('\x1b[36m🐣️ postMarkAsRead postId not found\x1b[0m');
    return;
  }

  try {
    await streamApi.putMarkAsRead(postId);

    callback?.(true);

    const post = usePostsStore.getState()?.posts?.[postId] || {};
    usePostsStore.getState().actions.addToPosts({
      data: {
        ...post,
        markedReadPost: true,
        markedReadSuccess: true,
      },
    } as IPayloadAddToAllPost);

    // tracking event
    const eventImportantMarkedProperties: TrackingEventImportantMarkedProperties = {
      content_type: post.type,
    };
    trackEvent({ event: TrackingEventType.IMPORTANT_MARKED, properties: eventImportantMarkedProperties });
  } catch (error) {
    callback?.(false);
    showToastError(error);
  }
};

export default putMarkAsRead;
