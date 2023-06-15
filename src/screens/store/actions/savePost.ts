import streamApi from '~/api/StreamApi';
import { IPayloadAddToAllPost, PostType } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';

const savePost = (_set, _get) => async (id: string, _type: PostType) => {
  try {
    const response = await streamApi.postSaveContent(id);
    const post = usePostsStore.getState()?.posts?.[id] || {};
    const newPost = {
      ...post,
      isSaved: true,
    };
    usePostsStore.getState().actions.addToPosts({ data: newPost } as IPayloadAddToAllPost);
    showToastSuccess(response);
  } catch (error) {
    console.error('savePost error:', error);
    showToastError(error);
  }
};

export default savePost;
