import streamApi from '~/api/StreamApi';
import { IPostCreatePost } from '~/interfaces/IPost';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import usePostsStore from '~/store/entities/posts';
import showToastError from '~/store/helper/showToastError';
import { ICreatePostState } from '..';

const navigation = withNavigation?.(rootNavigationRef);

export const createNewPost = (set, _get) => async (payload: IPostCreatePost) => {
  try {
    const resp = await streamApi.postCreateNewPost(payload);
    if (resp?.data) {
      usePostsStore.getState().actions.addToPosts({ data: resp.data });
      set((state: ICreatePostState) => {
        state.createPost.id = resp.data.id;
      }, 'createNewPost');
    }
  } catch (e) {
    console.error('\x1b[35m🐣️ createNewPost error: ', e, '\x1b[0m');
    showToastError(e);
    navigation.goBack();
  }
};

export default createNewPost;
