import streamApi from '~/api/StreamApi';
import modalActions from '~/storeRedux/modal/actions';
import Store from '~/storeRedux';
import { IPayloadAddToAllPost, PostType } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';

const savePost = (_set, _get) => async (id: string, type: PostType) => {
  try {
    await streamApi.postSavePost(id);
    const post = usePostsStore.getState()?.posts?.[id] || {};
    const newPost = {
      ...post,
      isSaved: true,
    };
    usePostsStore.getState().actions.addToPosts({ data: newPost } as IPayloadAddToAllPost);
    Store.store.dispatch(modalActions.showHideToastMessage({ content: `${type.toLowerCase()}:text_saved` }));
  } catch (error) {
    console.error('savePost error:', error);
    Store.store.dispatch(modalActions.showHideToastMessage({ content: 'common:text_save_fail' }));
  }
};

export default savePost;
