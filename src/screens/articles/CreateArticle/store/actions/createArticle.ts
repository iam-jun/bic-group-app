import streamApi from '~/api/StreamApi';
import usePostsStore from '~/store/entities/posts';
import showToastError from '~/store/helper/showToastError';

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
    showToastError(error);
  }
};

export default createArticle;
