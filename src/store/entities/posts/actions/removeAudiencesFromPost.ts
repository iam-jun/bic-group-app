import { IPayloadAddToAllPost, IPayloadRemoveAudiencesOfPost } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';

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
    const response = await streamApi.putPublishPost({
      postId: id,
      data,
    });
    if (response?.data) {
      const post = response?.data;
      usePostsStore.getState().actions.addToPosts({ data: post } as IPayloadAddToAllPost);
      showToastSuccess(response);
    }
  } catch (e) {
    console.error('\x1b[31m🐣️ action removeAudiencesFromPost error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default removeAudiencesFromPost;
