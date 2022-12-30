import streamApi from '~/api/StreamApi';
import usePostsStore from '~/store/entities/posts';
import showError from '~/store/helper/showError';

const createArticle = (set, _get) => async () => {
  try {
    const response = await streamApi.createArticle();
    const data = response?.data;

    if (data) {
      set((state) => {
        state.data.id = data.id;
      }, 'createArticle');

      usePostsStore.getState().actions.addToPosts({ data });
    } else throw new Error('Create article error');
  } catch (error) {
    showError(error);
  }
};

export default createArticle;
