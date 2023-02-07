import { IPayloadPutMarkSeenPost } from '~/interfaces/IPost';
import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';

const putMarkSeenPost = () => async (payload: IPayloadPutMarkSeenPost) => {
  if (!payload) {
    return;
  }

  const { postId } = payload;
  if (!postId) {
    console.error('\x1b[36m🐣️ postMarkAsRead postId not found\x1b[0m');
    return;
  }

  try {
    await streamApi.putMarkSeenPost(postId);
  } catch (error) {
    showToastError(error);
  }
};

export default putMarkSeenPost;
