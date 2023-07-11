import streamApi from '~/api/StreamApi';
import { IPayloadGetDraftContents, PostType } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import IDraftPostState from '../Interface';
import { getNewPosts } from '~/helpers/post';

const getDraftPosts = (set, get) => async (payload: IPayloadGetDraftContents) => {
  const { isRefresh = true } = payload;
  const data: IDraftPostState = get();
  const {
    posts: draftPosts,
    hasNextPage,
    endCursor,
    refreshing,
    loading,
  } = data || {};

  try {
    if (!refreshing && !loading && (isRefresh || hasNextPage)) {
      set((state: IDraftPostState) => {
        if (isRefresh) {
          state.refreshing = true;
        } else {
          state.loading = true;
        }
      }, 'getDraftPosts');

      const endCursorParams = isRefresh ? null : endCursor;
      const response = await streamApi.getDraftContents({
        endCursor: endCursorParams,
        type: PostType.POST
      });

      const newPosts = getNewPosts({ isRefresh, response, list: draftPosts });

      set((state: IDraftPostState) => {
        state.posts = newPosts;
        state.hasNextPage = response?.data?.meta?.hasNextPage;
        state.endCursor = response?.data?.meta?.endCursor;
        state.refreshing = false;
        state.loading = false;
      }, 'getDraftPostsSuccess');
      usePostsStore.getState().actions.addToPosts({ data: newPosts });
    } else {
      console.warn('\x1b[36m🐣️ action getDraftPosts cant load more\x1b[0m');
    }
  } catch (e) {
    set((state: IDraftPostState) => {
      state.refreshing = false;
      state.loading = false;
      state.endCursor = null;
    }, 'getDraftPostsError');
    console.error('\x1b[31m🐣️ action getDraftPosts error: ', e, '\x1b[0m');
  }
};

export default getDraftPosts;
