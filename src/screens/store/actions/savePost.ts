import streamApi from '~/api/StreamApi';
import { IPayloadAddToAllPost, PostType } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import showToast from '~/store/helper/showToast';

const savePost = (_set, _get) => async (id: string, type: PostType) => {
  try {
    await streamApi.postSaveContent(id);
    const post = usePostsStore.getState()?.posts?.[id] || {};
    const newPost = {
      ...post,
      isSaved: true,
    };
    usePostsStore.getState().actions.addToPosts({ data: newPost } as IPayloadAddToAllPost);
    showToast({ content: `${type.toLowerCase()}:text_saved` });
  } catch (error) {
    console.error('savePost error:', error);
    showToast({ content: 'common:text_save_fail' });
  }
};

export default savePost;
