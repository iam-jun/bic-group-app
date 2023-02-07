import { IPayloadAddToAllPost, IPayloadPutMarkAsRead } from '~/interfaces/IPost';
import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import usePostsStore from '~/store/entities/posts';

const putMarkAsRead = () => async (payload: IPayloadPutMarkAsRead) => {
  const { postId, callback } = payload;

  if (!postId) {
    console.error('\x1b[36m🐣️ postMarkAsRead postId not found\x1b[0m');
    return;
  }

  try {
    const response = await streamApi.putMarkAsRead(postId);

    const isSuccess = !!response?.data;
    callback?.(isSuccess);
    if (isSuccess) {
      const post = usePostsStore.getState()?.posts?.[postId] || {};
      usePostsStore.getState().actions.addToPosts({
        data: {
          ...post,
          markedReadPost: true,
          markedReadSuccess: true,
        },
      } as IPayloadAddToAllPost);
    }
  } catch (error) {
    callback?.(false);
    showToastError(error);
  }
};

export default putMarkAsRead;
