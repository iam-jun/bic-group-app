import { IPayloadAddToAllPost, IPayloadRemoveAudiencesOfPost } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import streamApi from '~/api/StreamApi';
import showToast from '~/store/helper/showToast';
import showToastError from '~/store/helper/showToastError';

const removeAudiencesFromPost = () => async (payload: IPayloadRemoveAudiencesOfPost) => {
  const { id, listAudiences } = payload || {};
  if (!id || !listAudiences?.length) {
    console.warn('\x1b[31m🐣️ action removeAudiencesFromPost: id not found or listAudiences is not an array\x1b[0m');
    return;
  }
  try {
    const data = {
      audience: {
        userIds: [],
        groupIds: listAudiences,
      },
    };
    const response = await streamApi.putEditPost({
      postId: id,
      data,
    });
    if (response?.data) {
      const post = response?.data;
      usePostsStore.getState().actions.addToPosts({ data: post } as IPayloadAddToAllPost);
      showToast({ content: 'post:text_deleted_audiences' });
    }
  } catch (e) {
    console.error('\x1b[31m🐣️ action removeAudiencesFromPost error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default removeAudiencesFromPost;
