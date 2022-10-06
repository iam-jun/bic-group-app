import streamApi from '~/api/StreamApi';

const getUsersInterestedPost = (set, get) => async (postId: string) => {
  try {
    const { data, hasNextPage } = get();

    if (!hasNextPage) {
      return;
    }

    set({
      loading: true,
    }, 'getUsersInterestedPost');

    const params = {
      postId,
      offset: data.length,
    };
    const response = await streamApi.getUsersInterestedPost(params);

    if (!response || !response.data) {
      set({
        loading: false,
      }, 'getUsersInterestedPostFailed');
      return;
    }

    const { list, meta } = response.data;
    set({
      loading: false,
      data: [...data, ...list],
      hasNextPage: meta.hasNextPage,
    }, 'getUsersInterestedPostSuccess');
  } catch (e) {
    console.error(
      '\x1b[31m🐣️ getUsersInterestedPost error: ', e, '\x1b[0m',
    );
    set({
      loading: false,
    }, 'getUsersInterestedPostFailed');
  }
};

export default getUsersInterestedPost;
